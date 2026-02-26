using System;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IStockMovementRepository
{
    Task CreateStockMovement(CreateStockMovementDto createStockMovementDto);
    Task<PaginatedResult<StockMovement>> GetStockMovements(PagingParams pagingParams);
    Task<bool> ApproveStockMovement(string stockMovementId);
    Task<bool> DisApproveStockMovement(string stockMovementId);
}
