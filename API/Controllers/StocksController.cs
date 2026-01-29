using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class StocksController(AppDbContext context) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Key>>> GetKeys()
        {
            var keys = await context.Keys.ToListAsync();
            return Ok(keys);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Key>> GetKeyById(string id)
        {
            var key = await context.Keys.FindAsync(id);
            if(key is null)
            {
                return NotFound();
            }
            return Ok(key);
        }
    }
}
