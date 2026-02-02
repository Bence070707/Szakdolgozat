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
    }
}
