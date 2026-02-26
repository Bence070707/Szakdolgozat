using System;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class StockMovementRepository(AppDbContext context) : IStockMovementRepository
{
    public async Task<bool> ApproveStockMovement(string stockMovementId)
    {
        var stockMovement = await context.StockMovements.FindAsync(stockMovementId);

        if(stockMovement is null || stockMovement.Status != StockMovementStatus.PENDING) return false;

        var product = await context.Keys.FindAsync(stockMovement.ProductId);

        if(product is null) return false;

        product.Quantity = stockMovement.QuantityAfter;
        product.Price = stockMovement.PriceAfter;

        stockMovement.Status = StockMovementStatus.ACCEPTED;
        stockMovement.DecidedAt = DateTime.UtcNow;

        return await context.SaveChangesAsync() > 0;
    }

    public Task CreateStockMovement(CreateStockMovementDto createStockMovementDto)
    {
        var stockMovement = new StockMovement
        {
            ProductId = createStockMovementDto.ProductId,
            QuantityBefore = createStockMovementDto.QuantityBefore,
            QuantityAfter = createStockMovementDto.QuantityAfter,
            PriceBefore = createStockMovementDto.PriceBefore,
            PriceAfter = createStockMovementDto.PriceAfter
        };

        context.StockMovements.Add(stockMovement);
        return context.SaveChangesAsync();
    }

    public async Task<bool> DisApproveStockMovement(string stockMovementId)
    {
        var stockMovement = await context.StockMovements.FindAsync(stockMovementId);

        if(stockMovement is null || stockMovement.Status != StockMovementStatus.PENDING) return false;

        stockMovement.Status = StockMovementStatus.DENIED;
        stockMovement.DecidedAt = DateTime.UtcNow;

        return await context.SaveChangesAsync() > 0;
    }

    public async Task<PaginatedResult<StockMovement>> GetStockMovements(PagingParams pagingParams)
    {
        var query = context.StockMovements.Include(x => x.User).AsQueryable();
        return await PaginationHelper.CreateAsync(query, pagingParams.PageNumber, pagingParams.PageSize);
    }
}
