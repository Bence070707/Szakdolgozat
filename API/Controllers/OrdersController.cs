using API.DTOs;
using API.Entities;
using API.Helpers;
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

        [HttpGet]
        public async Task<ActionResult<PaginatedResult<OrderDTO>>> GetOrders([FromQuery]PagingParams pagingParams)
        {
            var orders = await orderRepository.GetOrders(pagingParams);
            return Ok(orders);
        }

        [HttpPost("draft")]
        public async Task<ActionResult<OrderDTO>> CreateDraft()
        {
            var order = await orderRepository.CreateDraft();
            return Ok(order);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDTO>> GetOrderById(string id)
        {
            var order = await orderRepository.GetOrderById(id);
            if(order is null) return NotFound("Nem található rendelés.");
            return Ok(order.ToDTO());
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateOrder(string id, OrderDTO orderDTO)
        {
            var result = await orderRepository.UpdateOrder(id, orderDTO);
            if (!result) return NotFound("Nem található rendelés.");
            return NoContent();
        }

        [HttpGet("getdrafts")]
        public async Task<ActionResult<IReadOnlyList<OrderDTO>>> GetDrafts()
        {
            var order = await orderRepository.GetDrafts();
            return Ok(order.Select(o => o.ToDTO()));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteOrder(string id)
        {
            var result = await orderRepository.DeleteOrder(id);
            if (!result) return NotFound("Nem található rendelés.");
            return NoContent();
        }

        [HttpPost("{id}/submit")]
        public async Task<ActionResult> SubmitOrder(string id, OrderDTO orderDTO)
        {
            var result = await orderRepository.SubmitOrder(id, orderDTO);
            if (!result) return NotFound("Nem található rendelés.");
            return NoContent();
        }

    }
}
