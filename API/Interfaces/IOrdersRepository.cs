using System;
using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IOrdersRepository
{
    Task CreateOrderAsync(CreatePurchaseOrderDTO createPurchaseOrderDTO);
    Task<string> CreateDraft();
    Task<PurchaseOrder?> GetOrderById(string id);
    Task<bool> UpdateOrder(string id, OrderDTO orderDTO);
    Task<IReadOnlyList<PurchaseOrder>> GetDrafts();
}
