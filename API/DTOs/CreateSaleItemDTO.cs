using System;
using API.Enums;

namespace API.DTOs;

public class CreateSaleItemDTO
{
    public ProductType ProductType { get; set; }
    public required string ProductId { get; set; }
    public int Quantity { get; set; }
}
