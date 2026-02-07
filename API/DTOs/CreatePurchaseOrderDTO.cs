using System;
using API.Entities;

namespace API.DTOs;

public class CreatePurchaseOrderDTO
{
    public List<CreatePurchaseOrderItemDTO> Items { get; set; } = [];
    public PurchaseOrderStatus PurchaseOrderStatus { get; set; }
    public string? Note { get; set; }
}
