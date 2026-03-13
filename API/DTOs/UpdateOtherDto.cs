using Microsoft.AspNetCore.Http;

namespace API.DTOs;

public class UpdateOtherDto
{
    public required string Id { get; set; }
    public required string Name { get; set; }
    public int Price { get; set; }
    public int Quantity { get; set; }
    public List<IFormFile> Images { get; set; } = [];
}
