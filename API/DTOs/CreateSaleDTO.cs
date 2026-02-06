using System;
using API.Entities;

namespace API.DTOs;

public class CreateSaleDTO
{
    public List<CreateSaleItemDTO> Items { get; set; } = [];
}
