using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin,Manager")]
    [Route("[controller]")]
    [ApiController]
    public class HeelsController(IHeelsRepository heelsRepository) : ControllerBase
    {

        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Heel>>> GetHeels([FromQuery] PagingParams pagingParams, [FromQuery] bool includeArchived = false)
        {
            var canIncludeArchived = includeArchived && User.IsInRole("Admin");
            var heels = await heelsRepository.GetHeels(pagingParams, canIncludeArchived);
            return Ok(heels);
        }

        [HttpGet("getallheels")]
        public async Task<ActionResult<IReadOnlyList<Heel>>> GetAllHeels([FromQuery] bool includeArchived = false)
        {
            var canIncludeArchived = includeArchived && User.IsInRole("Admin");
            var heels = await heelsRepository.GetAllHeelsAsync(canIncludeArchived);
            return Ok(heels);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Heel>> GetHeelById(string id)
        {
            var heel = await heelsRepository.FindHeelById(id);
            if (heel == null)
            {
                return NotFound();
            }
            return Ok(heel);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Heel>> UpdateHeel(string id, Heel updatedHeel)
        {
            if (id != updatedHeel.Id)
            {
                return BadRequest("Nem ugyanaz az ID.");
            }

            var heel = await heelsRepository.FindHeelById(id);

            if (heel is null) return BadRequest("Sarok nem található");

            heel.Price = updatedHeel.Price;
            heel.Quantity = updatedHeel.Quantity;
            await heelsRepository.UpdateHeel(heel);
            return Ok(heel);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("archive/{id}")]
        public async Task<ActionResult> ArchiveHeel(string id)
        {
            var heel = await heelsRepository.FindHeelById(id);
            if (heel is null) return NotFound("Sarok nem található");

            if (heel.IsArchived) return Ok();

            var archived = await heelsRepository.ArchiveHeelAsync(id);
            if (!archived) return BadRequest("Hiba történt a sarok archiválása során");

            return Ok();
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("unarchive/{id}")]
        public async Task<ActionResult> UnarchiveHeel(string id)
        {
            var heel = await heelsRepository.FindHeelById(id);
            if (heel is null) return NotFound("Sarok nem található");

            if (!heel.IsArchived) return Ok();

            var unarchived = await heelsRepository.UnarchiveHeelAsync(id);
            if (!unarchived) return BadRequest("Hiba történt a sarok visszaállítása során");

            return Ok();
        }
    }
}
