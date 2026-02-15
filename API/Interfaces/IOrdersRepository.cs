using System;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IOrdersRepository
{
    Task CreateOrderAsync(CreatePurchaseOrderDTO createPurchaseOrderDTO);
    Task<OrderDTO> CreateDraft();
    Task<PurchaseOrder?> GetOrderById(string id);
    Task<bool> UpdateOrder(string id, OrderDTO orderDTO);
    Task<IReadOnlyList<PurchaseOrder>> GetDrafts();
    Task<bool> DeleteOrder(string id);
    Task<PaginatedResult<OrderDTO>> GetOrders(PagingParams pagingParams);
    Task<bool> SubmitOrder(string id, OrderDTO orderDTO);
    Task<IReadOnlyList<SummarisedOrderItemDTO>> GetSummarisedOrderItemDTOsAsync(string id);
    Task<bool> ReceiveOrder(string id, OrderDTO orderDTO);
}
