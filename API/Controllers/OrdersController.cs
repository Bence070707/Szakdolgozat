using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class OrdersController(IOrdersRepository orderRepository) : ControllerBase
    {
        [HttpPost]
        public async Task<ActionResult> CreateOrder(CreatePurchaseOrderDTO createPurchaseOrderDTO)
        {
            await orderRepository.CreateOrderAsync(createPurchaseOrderDTO);
            return Ok();
        }
    }
}
