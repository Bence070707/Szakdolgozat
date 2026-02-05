using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class HeelsController(IHeelsRepository heelsRepository) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Heel>>> GetHeels([FromQuery] PagingParams pagingParams)
        {
            var heels = await heelsRepository.GetHeels(pagingParams);
            return Ok(heels);
        }

        [HttpGet("getallheels")]
        public async Task<ActionResult<IReadOnlyList<Heel>>> GetAllHeels()
        {
            var heels = await heelsRepository.GetAllHeelsAsync();
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
            if(id != updatedHeel.Id)
            {
                return BadRequest("Nem ugyanaz az ID.");
            }

            var heel = await heelsRepository.FindHeelById(id);

            if(heel is null) return BadRequest("Sarok nem található");

            heel.Price = updatedHeel.Price;
            heel.Quantity = updatedHeel.Quantity;
            await heelsRepository.UpdateHeel(heel);
            return Ok(heel);
        }
    }
}
