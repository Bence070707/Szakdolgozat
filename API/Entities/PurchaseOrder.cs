using System;

namespace API.Entities;

public class PurchaseOrder
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public string CreatedBy { get; set; } = "System";
    public PurchaseOrderStatus PurchaseOrderStatus { get; set; }
    public DateTime? SentAt { get; set; }
    public DateTime? ReceivedAt { get; set; }
    public string? Note { get; set; }
    public ICollection<PurchaseOrderItem> Items { get; set; } = [];
}

public enum PurchaseOrderStatus {
    DRAFT = 1,
    SEND = 2,
    RECEIVED = 3,
    CANCELLED = 4
}
