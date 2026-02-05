using API.Data;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
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
        public async Task<ActionResult<Key>> UpdateKey(string id, Key updatedKey)
        {
            if (id != updatedKey.Id)
            {
                return BadRequest("Nem ugyanaz az ID.");
            }

            var key = await keysRepository.FindKeyByIdAsync(id);

            if (key is null) return BadRequest("Kulcs nem található");

            key.Price = updatedKey.Price;
            key.Quantity = updatedKey.Quantity;
            key.PriceType = updatedKey.PriceType;
            await keysRepository.UpdateKey(key);
            return Ok(key);
        }
    }
}
