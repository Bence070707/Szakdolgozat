using System;
using API.DTOs;
using API.Entities;
using API.Interfaces;

namespace API.Data;

public class OrdersRepository(AppDbContext context) : IOrdersRepository
{
    public async Task CreateOrderAsync(CreatePurchaseOrderDTO createPurchaseOrderDTO)
    {
        var order = new PurchaseOrder
        {
            Note = createPurchaseOrderDTO.Note,
            PurchaseOrderStatus = createPurchaseOrderDTO.PurchaseOrderStatus,
            Items = [.. createPurchaseOrderDTO.Items.Select(o => new PurchaseOrderItem
            {
                KeyId = o.KeyId,
                Quantity = o.Quantity
            })]
        };

        context.PurchaseOrders.Add(order);
        await context.SaveChangesAsync();
    }
}
