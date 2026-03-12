using System;
using System.Text.Json.Serialization;

namespace API.Entities;

public class KeyImage
{
    public int Id { get; set; }
    public required string Url { get; set; }
    public string? PublicId { get; set; }
    public string KeyId { get; set; } = default!;
    public bool IsMain { get; set; } = false;
    [JsonIgnore]
    public Key Key { get; set; } = default!;
}
