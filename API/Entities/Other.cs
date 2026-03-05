namespace API.Entities;

public class Other
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Name { get; set; }
    public required int Price { get; set; }
    public required int Quantity { get; set; }
    public bool IsArchived { get; set; }
    public DateTime? ArchivedAt { get; set; }
}
