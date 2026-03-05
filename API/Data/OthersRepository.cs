using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class OthersRepository(AppDbContext context) : IOthersRepository
{
    public async Task<Other?> FindOtherById(string id)
    {
        return await context.Others.FindAsync(id);
    }

    public async Task<IReadOnlyList<Other>> GetAllOthersAsync(bool includeArchived = false)
    {
        return await context.Others
            .Where(x => includeArchived || !x.IsArchived)
            .ToListAsync();
    }

    public async Task<PaginatedResult<Other>> GetOthers(PagingParams pagingParams, bool includeArchived = false)
    {
        var query = context.Others
            .Where(x => includeArchived || !x.IsArchived)
            .AsQueryable();

        if (!string.IsNullOrEmpty(pagingParams.Search))
        {
            query = query.Where(x => x.Name.ToLower().Contains(pagingParams.Search.ToLower()));
        }

        return await PaginationHelper.CreateAsync(query, pagingParams.PageNumber, pagingParams.PageSize);
    }

    public async Task UpdateOther(Other other)
    {
        context.Others.Update(other);
        await context.SaveChangesAsync();
    }

    public async Task<bool> ArchiveOtherAsync(string id)
    {
        var updated = await context.Others
            .Where(x => x.Id == id && !x.IsArchived)
            .ExecuteUpdateAsync(setter => setter
                .SetProperty(x => x.IsArchived, _ => true)
                .SetProperty(x => x.ArchivedAt, _ => DateTime.UtcNow));

        return updated > 0;
    }

    public async Task<bool> UnarchiveOtherAsync(string id)
    {
        var updated = await context.Others
            .Where(x => x.Id == id && x.IsArchived)
            .ExecuteUpdateAsync(setter => setter
                .SetProperty(x => x.IsArchived, _ => false)
                .SetProperty(x => x.ArchivedAt, _ => null));

        return updated > 0;
    }

    public async Task<string?> CreateOther(CreateOtherDto createOtherDto)
    {
        var newOther = new Other
        {
            Name = createOtherDto.Name,
            Quantity = createOtherDto.Quantity,
            Price = createOtherDto.Price
        };

        context.Others.Add(newOther);
        var result = await context.SaveChangesAsync() > 0;

        if (result) return newOther.Id;
        return null;
    }
}
