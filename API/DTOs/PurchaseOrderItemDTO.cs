using System;

namespace API.DTOs;

public class PurchaseOrderItemDTO
{
    public required string KeyId { get; set; }
    public int Quantity { get; set; }
}
