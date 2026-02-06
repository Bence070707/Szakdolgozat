using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SalesController(ISalesRepository salesRepository) : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult> CreateSale(CreateSaleDTO createSaleDTO)
        {
            await salesRepository.CreateSaleAsnyc(createSaleDTO);
            return Ok();
        }
    }
}
