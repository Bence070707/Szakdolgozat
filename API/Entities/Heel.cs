using System;

namespace API.Entities;

public class Heel
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Code { get; set; }
    public required int Price { get; set; }
    public required int Quantity { get; set; }
    public bool IsArchived { get; set; }
    public DateTime? ArchivedAt { get; set; }
}
