using System.Text.Json.Serialization;

namespace API.Entities;

public class HeelImage
{
    public int Id { get; set; }
    public required string Url { get; set; }
    public string? PublicId { get; set; }
    public string HeelId { get; set; } = default!;
    public bool IsMain { get; set; }
    [JsonIgnore]
    public Heel Heel { get; set; } = default!;
}
