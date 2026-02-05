using System;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class KeysRepository(AppDbContext context) : IKeysRepository
{
    public async Task<Key?> FindKeyByIdAsync(string id)
    {
        return await context.Keys.FindAsync(id);
    }

    public async Task<IReadOnlyList<Key>> GetAllKeysAsync()
    {
        return await context.Keys.ToListAsync();
    }

    public async Task<PaginatedResult<Key>> GetKeysAsync(PagingParams pagingParams)
    {
        return await PaginationHelper.CreateAsync(context.Keys, pagingParams.PageNumber, pagingParams.PageSize);
    }

    public async Task UpdateKey(Key key)
    {
        context.Keys.Update(key);
        await context.SaveChangesAsync();
    }
}
