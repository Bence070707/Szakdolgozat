using System.Text.Json.Serialization;

namespace API.Entities;

public class OtherImage
{
    public int Id { get; set; }
    public required string Url { get; set; }
    public string? PublicId { get; set; }
    public string OtherId { get; set; } = default!;
    public bool IsMain { get; set; }
    [JsonIgnore]
    public Other Other { get; set; } = default!;
}
