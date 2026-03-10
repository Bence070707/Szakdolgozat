using Microsoft.AspNetCore.Http;

namespace API.DTOs;

public class UpdateKeyDto
{
    public required string Id { get; set; }
    public int PriceType { get; set; }
    public int Price { get; set; }
    public int Quantity { get; set; }
    public List<IFormFile> Images { get; set; } = [];
}
