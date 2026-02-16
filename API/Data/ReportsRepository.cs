using System;
using API.DTOs;
using API.Enums;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class ReportsRepository(AppDbContext context) : IReportsRepository
{
    public Task<ReportDTO> GetReport(ReportType reportType, DateTime? from)
    {
        return reportType switch
        {
            ReportType.DAILY => GetDailyReport(from),
            ReportType.WEEKLY => GetWeeklyReport(from),
            ReportType.MONTHLY => GetMonthlyReport(from),
            ReportType.YEARLY => GetYearlyReport(from),
            _ => throw new ArgumentException("Nem megfelelő riport típus"),
        };
    }

    private async Task<ReportDTO> GetYearlyReport(DateTime? from)
    {
        var reference = from ?? DateTime.UtcNow;

        var start = new DateTime(reference.Year, 1, 1);
        var end = start.AddYears(1);

        var query = context.Sales
            .Where(x => x.SoldAt >= start && x.SoldAt < end);

        var totalRevenue = await query
            .SumAsync(x => (int?)x.TotalAmount) ?? 0;

        var totalSales = await query
            .CountAsync();

        var totalItemsSold = await query
            .SelectMany(x => x.Items)
            .SumAsync(x => (int?)x.Quantity) ?? 0;

        return new ReportDTO
        {
            TotalRevenue = totalRevenue,
            TotalSales = totalSales,
            TotalItemsSold = totalItemsSold
        };
    }

    private async Task<ReportDTO> GetMonthlyReport(DateTime? from)
    {
        var reference = from ?? DateTime.UtcNow;

        var start = new DateTime(reference.Year, reference.Month, 1);
        var end = start.AddMonths(1);

        var query = context.Sales
            .Where(x => x.SoldAt >= start && x.SoldAt < end);

        var totalRevenue = await query
            .SumAsync(x => (int?)x.TotalAmount) ?? 0;

        var totalSales = await query
            .CountAsync();

        var totalItemsSold = await query
            .SelectMany(x => x.Items)
            .SumAsync(x => (int?)x.Quantity) ?? 0;

        return new ReportDTO
        {
            TotalRevenue = totalRevenue,
            TotalSales = totalSales,
            TotalItemsSold = totalItemsSold
        };
    }

    private async Task<ReportDTO> GetWeeklyReport(DateTime? from)
    {
        var reference = from ?? DateTime.UtcNow;

        var start = StartOfWeek(reference);
        var end = start.AddDays(7);

        var query = context.Sales
            .Where(x => x.SoldAt >= start && x.SoldAt < end);

        var totalRevenue = await query
            .SumAsync(x => (int?)x.TotalAmount) ?? 0;

        var totalSales = await query
            .CountAsync();

        var totalItemsSold = await query
            .SelectMany(x => x.Items)
            .SumAsync(x => (int?)x.Quantity) ?? 0;

        return new ReportDTO
        {
            TotalRevenue = totalRevenue,
            TotalSales = totalSales,
            TotalItemsSold = totalItemsSold
        };
    }

    private async Task<ReportDTO> GetDailyReport(DateTime? from)
    {
        var reference = from ?? DateTime.UtcNow;
        var start = reference.Date;
        var end = start.AddDays(1);

        var query = context.Sales.Where(x => x.SoldAt >= start && x.SoldAt < end);

        var totalRevenue = await query
            .SumAsync(x => (int?)x.TotalAmount) ?? 0;

        var totalSales = await query
            .CountAsync();

        var totalItemsSold = await query
            .SelectMany(x => x.Items)
            .SumAsync(x => (int?)x.Quantity) ?? 0;

        return new ReportDTO
        {
            TotalRevenue = totalRevenue,
            TotalSales = totalSales,
            TotalItemsSold = totalItemsSold
        };
    }

    private static DateTime StartOfWeek(DateTime date)
    {
        int diff = (7 + (date.DayOfWeek - DayOfWeek.Monday)) % 7;
        return date.Date.AddDays(-diff);
    }
}
