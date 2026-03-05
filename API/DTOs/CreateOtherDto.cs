namespace API.DTOs;

public class CreateOtherDto
{
    public required string Name { get; set; }
    public int Price { get; set; }
    public int Quantity { get; set; }
}
