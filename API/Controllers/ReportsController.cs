using API.DTOs;
using API.Enums;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("[controller]")]
    [ApiController]
    public class ReportsController(IReportsRepository reportsRepository) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<ReportDTO>> GetReport([FromQuery]string type, [FromQuery]DateTime? from)
        {
            if (!Enum.TryParse<ReportType>(type, true, out var reportType))
            {
                return BadRequest("Nem megfelelő riport típus");
            }

            var report = await reportsRepository.GetReport(reportType, from);
            return Ok(report);
        }

        [HttpGet("fromto")]
        public async Task<ActionResult<ReportDTO>> GetReportFromTo([FromQuery]string type, [FromQuery]DateTime? from, [FromQuery]DateTime? to)
        {
            if (!Enum.TryParse<ReportType>(type, true, out var reportType))
            {
                return BadRequest("Nem megfelelő riport típus");
            }

            var report = await reportsRepository.GetReportFromTo(reportType, from, to);
            return Ok(report);
        }

        [HttpGet("user-month")]
        public async Task<ActionResult<ReportDTO>> GetUserMonthlyReport([FromQuery]DateTime? month, [FromQuery]string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
            {
                return BadRequest("A felhasználó azonosító kötelező");
            }

            var report = await reportsRepository.GetMonthlyUserReport(month, userId);
            return Ok(report);
        }
    }
}
