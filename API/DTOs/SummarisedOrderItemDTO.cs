namespace API.DTOs;

public class SummarisedOrderItemDTO
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public int Quantity { get; set; }
}
