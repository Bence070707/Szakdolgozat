using System;

namespace API.Entities;

public class Sale
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public DateTime SoldAt { get; set; } = DateTime.UtcNow;
    public int TotalAmount { get; set; }
    public ICollection<SaleItem> Items { get; set; } = [];
}
