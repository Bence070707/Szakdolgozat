using System.Security.Claims;
using API.Data;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize(Roles = "Admin,Manager")]
    [Route("[controller]")]
    [ApiController]
    public class KeysController(IKeysRepository keysRepository) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Key>>> GetKeys([FromQuery] PagingParams pagingParams)
        {
            var keys = await keysRepository.GetKeysAsync(pagingParams);
            return Ok(keys);
        }

        [HttpGet("getallkeys")]
        public async Task<ActionResult<IReadOnlyList<Key>>> GetAllKeys()
        {
            var keys = await keysRepository.GetAllKeysAsync();
            return Ok(keys);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Key>> GetKeyById(string id)
        {
            var key = await keysRepository.FindKeyByIdAsync(id);
            if (key == null)
            {
                return NotFound();
            }
            return Ok(key);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateKey(string id, Key updatedKey)
        {
            if (id != updatedKey.Id)
            {
                return BadRequest("Nem ugyanaz az ID.");
            }

            var baseKey = await keysRepository.FindKeyByIdAsync(id);

            if (baseKey is null) return BadRequest("Kulcs nem található");

            var isAdmin = User.IsInRole("Admin");
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if(userId is null) return BadRequest("Nem található bejelentkezett felhasználó.");

            var result = await keysRepository.UpdateKey(id, updatedKey, isAdmin, userId);

            if(result) return Ok();

            return BadRequest("Hiba történt a frissítés során");
        }
    }
}
