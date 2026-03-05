using API.DTOs;
using API.Entities;
using API.Enums;
using API.Interfaces;

namespace API.Data;

public class SalesRepository(AppDbContext context) : ISalesRepository
{
    public async Task CreateSaleAsnyc(CreateSaleDTO createSaleDTO, string userId)
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
        sale.UserId = userId;
        context.Sales.Add(sale);
        await context.SaveChangesAsync();

        await transaction.CommitAsync();
    }

    private async Task<int> GetUnitPriceAsync(CreateSaleItemDTO item)
    {
        return item.ProductType switch
        {
            ProductType.KEY => (await context.Keys.FindAsync(item.ProductId))?.Price
                ?? throw new Exception("Nem talalhato kulcs."),
            ProductType.HEEL => (await context.Heels.FindAsync(item.ProductId))?.Price
                ?? throw new Exception("Nem talalhato sarok."),
            ProductType.OTHER => (await context.Others.FindAsync(item.ProductId))?.Price
                ?? throw new Exception("Nem talalhato egyeb termek."),
            _ => throw new Exception("Nem talalhato termek.")
        };
    }

    private async Task DecreaseStockAsync(CreateSaleItemDTO item)
    {
        switch (item.ProductType)
        {
            case ProductType.KEY:
                var key = await context.Keys.FindAsync(item.ProductId) ?? throw new Exception("Nem talalhato kulcs");

                if (key.Quantity < item.Quantity) throw new Exception("Nincs eleg keszlet a kulcsbol.");
                key.Quantity -= item.Quantity;
                break;
            case ProductType.HEEL:
                var heel = await context.Heels.FindAsync(item.ProductId) ?? throw new Exception("Nem talalhato sarok");

                if (heel.Quantity < item.Quantity) throw new Exception("Nincs eleg keszlet a sarokbol.");
                heel.Quantity -= item.Quantity;
                break;
            case ProductType.OTHER:
                var other = await context.Others.FindAsync(item.ProductId) ?? throw new Exception("Nem talalhato egyeb termek");

                if (other.Quantity < item.Quantity) throw new Exception("Nincs eleg keszlet az egyeb termekbol.");
                other.Quantity -= item.Quantity;
                break;
        }
    }
}
