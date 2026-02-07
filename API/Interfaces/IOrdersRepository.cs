using System;
using API.DTOs;

namespace API.Interfaces;

public interface IOrdersRepository
{
    Task CreateOrderAsync(CreatePurchaseOrderDTO createPurchaseOrderDTO);
}
