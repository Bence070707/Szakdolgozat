using System;

namespace API.DTOs;

public class CreateStockMovementDto
{
    public required string ProductId { get; set; }
    public int QuantityBefore { get; set; }
    public int QuantityAfter { get; set; }
    public int PriceBefore { get; set; }
    public int PriceAfter { get; set; }
}
