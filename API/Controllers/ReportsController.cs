using API.DTOs;
using API.Enums;
using API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
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
    }
}
