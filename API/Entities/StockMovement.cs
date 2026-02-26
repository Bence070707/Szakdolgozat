using System;

namespace API.Entities;

public class StockMovement
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string ProductId { get; set; }
    public int QuantityBefore { get; set; }
    public int QuantityAfter { get; set; }
    public int PriceBefore { get; set; }
    public int PriceAfter { get; set; }
    public string? CreatedBy { get; set; } 
    public AppUser User { get; set; } = default!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public StockMovementStatus Status { get; set; } = StockMovementStatus.PENDING;
    public DateTime? DecidedAt { get; set; }
}

public enum StockMovementStatus
{
    PENDING = 1,
    ACCEPTED = 2,
    DENIED = 3
}