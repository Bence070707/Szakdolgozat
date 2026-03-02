using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("[controller]")]
    [ApiController]
    public class StockMovementsController(IStockMovementRepository stockMovementRepository) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<StockMovement>>> GetStockMovements([FromQuery] PagingParams pagingParams, [FromQuery] bool pendingOnly = false)
        {
            var stockMovements = await stockMovementRepository.GetStockMovements(pagingParams, pendingOnly);
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

        [HttpGet("getpendingapprovalcount")]
        public async Task<ActionResult> GetPendingApprovalCount()
        {
            return Ok(new {Count = await stockMovementRepository.GetApprovalCount()});
        }
    }
}
