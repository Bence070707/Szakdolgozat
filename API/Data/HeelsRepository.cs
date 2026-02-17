using System;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class HeelsRepository(AppDbContext context) : IHeelsRepository
{
    public async Task<Heel?> FindHeelById(string id)
    {
        return await context.Heels.FindAsync(id);
    }

    public async Task<IReadOnlyList<Heel>> GetAllHeelsAsync()
    {
        return await context.Heels.ToListAsync();
    }

    public async Task<PaginatedResult<Heel>> GetHeels(PagingParams pagingParams)
    {
        var query = context.Heels.AsQueryable();

        if (!string.IsNullOrEmpty(pagingParams.Search))
        {
            query = query.Where(x => x.Code.ToLower().Contains(pagingParams.Search.ToLower()));
        }
        return await PaginationHelper.CreateAsync(query, pagingParams.PageNumber, pagingParams.PageSize);
    }

    public async Task UpdateHeel(Heel heel)
    {
        context.Heels.Update(heel);
        await context.SaveChangesAsync();
    }
}
