using System;
using API.DTOs;
using API.Enums;

namespace API.Entities;

public class PurchaseOrder
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string CreatedBy { get; set; } = "System";
    public PurchaseOrderStatus PurchaseOrderStatus { get; set; }
    public DateTime? SentAt { get; set; }
    public DateTime? ReceivedAt { get; set; }
    public string? Note { get; set; }
    public string? SupplierEmail { get; set; }
    public ICollection<PurchaseOrderItem> Items { get; set; } = [];

}

public static class PurchaseOrderExtensions
{
    extension(PurchaseOrder purchaseOrder)
    {
        public OrderDTO ToDTO()
        {
            return new OrderDTO
            {
                Id = purchaseOrder.Id,
                Items = [.. purchaseOrder.Items.Select(o => new PurchaseOrderItemDTO
                {
                    Id = o.KeyId!,
                    Quantity = o.Quantity
                })],
                Note = purchaseOrder.Note,
                PurchaseOrderStatus = purchaseOrder.PurchaseOrderStatus,
                UpdatedAt = purchaseOrder.UpdatedAt,
                CreatedAt = purchaseOrder.CreatedAt,
                SentAt = purchaseOrder.SentAt,
                ReceivedAt = purchaseOrder.ReceivedAt,
                SupplierEmail = purchaseOrder.SupplierEmail
            };
        }

    }

}