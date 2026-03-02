namespace API.DTOs;

public class CreateHeelDto
{
    public required string Code { get; set; }
    public int Price { get; set; }
    public int Quantity { get; set; }
}