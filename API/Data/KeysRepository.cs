using System;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class KeysRepository(AppDbContext context, UserManager<AppUser> userManager) : IKeysRepository
{
    public async Task<Key?> FindKeyByIdAsync(string id)
    {
        return await context.Keys.FindAsync(id);
    }

    public async Task<IReadOnlyList<Key>> GetAllKeysAsync(bool includeArchived = false)
    {
        return await context.Keys
            .Where(x => includeArchived || !x.IsArchived)
            .ToListAsync();
    }

    public async Task<PaginatedResult<Key>> GetKeysAsync(PagingParams pagingParams, bool includeArchived = false)
    {
        var query = context.Keys
            .Where(x => includeArchived || !x.IsArchived)
            .AsQueryable();
        if (!string.IsNullOrEmpty(pagingParams.Search) && !string.IsNullOrWhiteSpace(pagingParams.Search))
        {
            query = query.Where(
                x => x.SilcaCode.ToLower().Contains(pagingParams.Search.ToLower())
                || x.ErrebiCode.ToLower().Contains(pagingParams.Search.ToLower())
                || x.JmaCode.ToLower().Contains(pagingParams.Search.ToLower()));
        }
        return await PaginationHelper.CreateAsync(query, pagingParams.PageNumber, pagingParams.PageSize);
    }

    public async Task<bool> UpdateKey(string id, Key updatedKey, bool isAdmin, string userId)
    {
        var product = await context.Keys.FindAsync(id);
        if(product is null) return false;

        if(id != updatedKey.Id) return false;

        var user = await userManager.FindByIdAsync(userId);
        if(user is null) return false;

        var movement = new StockMovement
        {
            ProductId = product.Id,
            QuantityBefore = product.Quantity,
            QuantityAfter = updatedKey.Quantity,
            PriceBefore = product.Price,
            PriceAfter = updatedKey.Price,
            CreatedBy = userId,
            User = user
        };


        if (isAdmin)
        {
            product.Quantity = updatedKey.Quantity;
            product.Price = updatedKey.Price;

            movement.Status = StockMovementStatus.ACCEPTED;
            movement.DecidedAt = DateTime.UtcNow;
        }

        context.StockMovements.Add(movement);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<bool> ArchiveKeyAsync(string id)
    {
        var updated = await context.Keys
            .Where(x => x.Id == id && !x.IsArchived)
            .ExecuteUpdateAsync(setter => setter
                .SetProperty(x => x.IsArchived, _ => true)
                .SetProperty(x => x.ArchivedAt, _ => DateTime.UtcNow));

        return updated > 0;
    }

    public async Task<bool> UnarchiveKeyAsync(string id)
    {
        var updated = await context.Keys
            .Where(x => x.Id == id && x.IsArchived)
            .ExecuteUpdateAsync(setter => setter
                .SetProperty(x => x.IsArchived, _ => false)
                .SetProperty(x => x.ArchivedAt, _ => null));

        return updated > 0;
    }
}
