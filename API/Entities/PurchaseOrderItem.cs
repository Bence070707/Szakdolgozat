using System;

namespace API.Entities;

public class PurchaseOrderItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string? PurchaseOrderId { get; set; }
    public PurchaseOrder PurchaseOrder { get; set; } = default!;
    public string? KeyId { get; set; }
    public Key Key { get; set; } = default!;
    public int Quantity { get; set; }
}
