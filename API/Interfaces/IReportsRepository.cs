using System;
using API.DTOs;
using API.Enums;

namespace API.Interfaces;

public interface IReportsRepository
{
    Task<ReportDTO> GetReport(ReportType reportType, DateTime? from);
}
