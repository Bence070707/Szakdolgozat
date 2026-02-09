using System;
using System.Runtime.CompilerServices;
using API.Entities;
using API.Enums;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace API.DTOs;

public class CreatePurchaseOrderDTO
{
    public List<CreatePurchaseOrderItemDTO> Items { get; set; } = [];
    public PurchaseOrderStatus PurchaseOrderStatus { get; set; }
    public string? Note { get; set; }
    
}

