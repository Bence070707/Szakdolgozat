using System.Security.Claims;
using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin,Manager")]
    [Route("[controller]")]
    [ApiController]
    public class SalesController(ISalesRepository salesRepository) : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult> CreateSale(CreateSaleDTO createSaleDTO)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if(userId == null) return Unauthorized();
            await salesRepository.CreateSaleAsnyc(createSaleDTO, userId);
            return Ok();
        }
    }
}
