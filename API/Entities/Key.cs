using System;
using API.Enums;

namespace API.Entities;

public class Key
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required KeyPriceType PriceType { get; set; } = KeyPriceType.TYPE1;
    public required string SilcaCode { get; set; }
    public string ErrebiCode { get; set; } = "";
    public string JmaCode { get; set; } = "";
    public required int Price { get; set; }
    public required int Quantity { get; set; }
}
