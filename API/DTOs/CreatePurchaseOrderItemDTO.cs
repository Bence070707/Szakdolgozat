using System;

namespace API.DTOs;

public class CreatePurchaseOrderItemDTO
{
    public required string KeyId { get; set; }
    public int Quantity { get; set; }
}
