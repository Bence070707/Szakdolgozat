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

    public async Task<IReadOnlyList<Heel>> GetAllHeelsAsync(bool includeArchived = false)
    {
        return await context.Heels
            .Where(x => includeArchived || !x.IsArchived)
            .ToListAsync();
    }

    public async Task<PaginatedResult<Heel>> GetHeels(PagingParams pagingParams, bool includeArchived = false)
    {
        var query = context.Heels
            .Where(x => includeArchived || !x.IsArchived)
            .AsQueryable();

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

    public async Task<bool> ArchiveHeelAsync(string id)
    {
        var updated = await context.Heels
            .Where(x => x.Id == id && !x.IsArchived)
            .ExecuteUpdateAsync(setter => setter
                .SetProperty(x => x.IsArchived, _ => true)
                .SetProperty(x => x.ArchivedAt, _ => DateTime.UtcNow));

        return updated > 0;
    }

    public async Task<bool> UnarchiveHeelAsync(string id)
    {
        var updated = await context.Heels
            .Where(x => x.Id == id && x.IsArchived)
            .ExecuteUpdateAsync(setter => setter
                .SetProperty(x => x.IsArchived, _ => false)
                .SetProperty(x => x.ArchivedAt, _ => null));

        return updated > 0;
    }
}
