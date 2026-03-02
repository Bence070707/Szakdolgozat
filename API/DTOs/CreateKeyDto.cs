namespace API.DTOs;

public class CreateKeyDto
{
    public required string SilcaCode { get; set; }
    public string? ErrebiCode { get; set; }
    public string? JmaCode { get; set; }
    public int Price { get; set; }
    public int Quantity { get; set; }
}
