using System;
using API.DTOs;
using API.Entities;
using API.Enums;
using API.Interfaces;

namespace API.Data;

public class SalesRepository(AppDbContext context) : ISalesRepository
{
    public async Task CreateSaleAsnyc(CreateSaleDTO createSaleDTO)
    {
        using var transaction = await context.Database.BeginTransactionAsync();

        var sale = new Sale();

        foreach (var item in createSaleDTO.Items)
        {
            int unitPrice = await GetUnitPriceAsync(item);
            await DecreaseStockAsync(item);

            sale.Items.Add(new SaleItem
            {
                ProductType = item.ProductType,
                ProductId = item.ProductId,
                Quantity = item.Quantity,
                UnitPrice = unitPrice
            });

        }
        sale.TotalAmount = sale.Items.Sum(s => s.LineTotal);
        context.Sales.Add(sale);
        await context.SaveChangesAsync();

        await transaction.CommitAsync();
    }


    private async Task<int> GetUnitPriceAsync(CreateSaleItemDTO item)
    {
        return item.ProductType switch
        {
            ProductType.KEY => (await context.Keys.FindAsync(item.ProductId))?.Price
            ?? throw new Exception("Nem található kulcs."),
            ProductType.HEEL => (await context.Heels.FindAsync(item.ProductId))?.Price
            ?? throw new Exception("Nem található sarok."),
            _ => throw new Exception("Nem található termék.")
        };
    }

    private async Task DecreaseStockAsync(CreateSaleItemDTO item)
    {
        switch (item.ProductType)
        {
            case ProductType.KEY:
                var key = await context.Keys.FindAsync(item.ProductId) ?? throw new Exception("Nem található kulcs");

                if (key.Quantity < item.Quantity) throw new Exception("Nincs elég készlet a kulcsból.");
                key.Quantity -= item.Quantity;
                break;
            case ProductType.HEEL:
                var heel = await context.Heels.FindAsync(item.ProductId) ?? throw new Exception("Nem található sarok");

                if (heel.Quantity < item.Quantity) throw new Exception("Nincs elég készlet a sarokból.");
                heel.Quantity -= item.Quantity;
                break;
        }
    }
}
