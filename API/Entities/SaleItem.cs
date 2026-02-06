using System;
using API.Enums;

namespace API.Entities;

public class SaleItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string? SaleId { get; set; }
    public Sale Sale { get; set; } = default!;
    public ProductType ProductType { get; set; }
    public required string ProductId { get; set; }
    public required int Quantity { get; set; }
    public required int UnitPrice { get; set; }
    public int LineTotal => Quantity * UnitPrice;
}
