using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("[controller]")]
    [ApiController]
    public class StockMovementsController(IStockMovementRepository stockMovementRepository) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<StockMovement>>> GetStockMovements([FromQuery] PagingParams pagingParams)
        {
            var stockMovements = await stockMovementRepository.GetStockMovements(pagingParams);
            return Ok(stockMovements);
        }

        [HttpPost]
        public async Task<ActionResult> ApproveStockMovement([FromQuery]string movementId)
        {
            var success = await stockMovementRepository.ApproveStockMovement(movementId);

            if(!success) return BadRequest("Hiba történt a készletmozgás elfogadásakor!");

            return Ok();
        }

        [HttpPost("disapprove")]
        public async Task<ActionResult> DisApproveStockMovement([FromQuery]string movementId)
        {
            var success = await stockMovementRepository.DisApproveStockMovement(movementId);

            if(!success) return BadRequest("Hiba történt a készletmozgás elfogadásakor!");

            return Ok();
        }
    }
}
