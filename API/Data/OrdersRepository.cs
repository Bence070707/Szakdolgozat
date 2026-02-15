using System;
using API.DTOs;
using API.Entities;
using API.Enums;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class OrdersRepository(AppDbContext context, IEmailService emailService) : IOrdersRepository
{
    public async Task<OrderDTO> CreateDraft()
    {
        var order = new PurchaseOrder
        {
            PurchaseOrderStatus = PurchaseOrderStatus.DRAFT
        };
        context.PurchaseOrders.Add(order);
        await context.SaveChangesAsync();
        return order.ToDTO();
    }

    public async Task CreateOrderAsync(CreatePurchaseOrderDTO createPurchaseOrderDTO)
    {
        var order = new PurchaseOrder
        {
            Note = createPurchaseOrderDTO.Note,
            PurchaseOrderStatus = createPurchaseOrderDTO.PurchaseOrderStatus,
            Items = [.. createPurchaseOrderDTO.Items.Select(o => new PurchaseOrderItem
            {
                KeyId = o.KeyId,
                Quantity = o.Quantity
            })]
        };

        context.PurchaseOrders.Add(order);
        context.Entry(order).State = EntityState.Added;
        await context.SaveChangesAsync();
    }

    public async Task<bool> DeleteOrder(string id)
    {
        var order = await context.PurchaseOrders.FindAsync(id);
        if (order is null) return false;
        context.PurchaseOrders.Remove(order);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<IReadOnlyList<PurchaseOrder>> GetDrafts()
    {
        return await context.PurchaseOrders
        .Include(x => x.Items)
            .Where(o => o.PurchaseOrderStatus == PurchaseOrderStatus.DRAFT)
            .ToListAsync();
    }

    public async Task<PurchaseOrder?> GetOrderById(string id)
    {
        return await context.PurchaseOrders.Include(x => x.Items).FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<PaginatedResult<OrderDTO>> GetOrders(PagingParams pagingParams)
    {
        var query = context.PurchaseOrders
            .Include(x => x.Items)
            .AsNoTracking()
            .Select(o => o.ToDTO());

        return await PaginationHelper.CreateAsync(query, pagingParams.PageNumber, pagingParams.PageSize);
    }

    public async Task<IReadOnlyList<SummarisedOrderItemDTO>> GetSummarisedOrderItemDTOsAsync(string id)
    {
        var order = await context.PurchaseOrders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order is null) return [];
        var keys = context.Keys.ToList();
        return [.. order.Items.Select(i =>
                    {
                        var key = keys.First(k => k.Id == i.KeyId);

                        return new SummarisedOrderItemDTO
                        {
                            Id = key.Id,
                            Name = key.SilcaCode ?? key.ErrebiCode ?? key.JmaCode,
                            Quantity = i.Quantity
                        };
                    })
                ];
    }

    public async Task<bool> ReceiveOrder(string id, OrderDTO orderDTO)
    {
        if(id != orderDTO.Id) return false;
        var order = await UpdateOrderAsync(id, orderDTO);
        if (order is null) return false;
        await UpdateStockAsync(order);
        order.PurchaseOrderStatus = PurchaseOrderStatus.RECEIVED;
        order.ReceivedAt = DateTime.UtcNow;
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<bool> SubmitOrder(string id, OrderDTO orderDTO)
    {
        var order = await UpdateOrderAsync(id, orderDTO);
        if (order is null) return false;

        order.PurchaseOrderStatus = PurchaseOrderStatus.SEND;
        order.SentAt = DateTime.UtcNow;
        await emailService.SendEmailAsync("Kulcsrendelés", orderDTO.SupplierEmail!);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateOrder(string id, OrderDTO orderDTO)
    {
        var order = await UpdateOrderAsync(id, orderDTO);
        if (order is null) return false;
        if (order.PurchaseOrderStatus != PurchaseOrderStatus.SEND) order.PurchaseOrderStatus = PurchaseOrderStatus.DRAFT;
        return await context.SaveChangesAsync() > 0;
    }


    private async Task<PurchaseOrder?> UpdateOrderAsync(string id, OrderDTO orderDTO)
    {
        var order = await context.PurchaseOrders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order is null) return null;
        order.Note = orderDTO.Note;
        order.SupplierEmail = orderDTO.SupplierEmail;

        var itemsToRemove = order.Items
            .Where(i => !orderDTO.Items.Any(d => d.Id == i.KeyId))
            .ToList();

        foreach (var item in itemsToRemove)
        {
            order.Items.Remove(item);
        }

        foreach (var dtoItem in orderDTO.Items)
        {
            var existing = order.Items
                .FirstOrDefault(i => i.KeyId == dtoItem.Id);

            if (existing is null)
            {
                order.Items.Add(new PurchaseOrderItem
                {
                    KeyId = dtoItem.Id,
                    Quantity = dtoItem.Quantity
                });
            }
            else
            {
                existing.Quantity = dtoItem.Quantity;
            }
        }
        context.Entry(order).State = EntityState.Modified;
        return order;
    }

    private async Task UpdateStockAsync(PurchaseOrder order)
    {
        foreach (var item in order.Items)
        {
            var key = await context.Keys.FindAsync(item.KeyId);
            key?.Quantity += item.Quantity;
        }
    }
}
