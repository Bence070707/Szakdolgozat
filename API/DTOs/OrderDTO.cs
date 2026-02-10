using System;
using API.Entities;
using API.Enums;

namespace API.DTOs;

public class OrderDTO
{
    public required string Id { get; set; }
    public ICollection<PurchaseOrderItemDTO> Items { get; set; } = [];
    public string? Note { get; set; }
    public string? SupplierEmail { get; set; }
    public PurchaseOrderStatus PurchaseOrderStatus { get; set; }
    public DateTime UpdatedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}
