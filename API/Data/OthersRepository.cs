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
        return await context.Others
            .Include(x => x.Images)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<IReadOnlyList<Other>> GetAllOthersAsync(bool includeArchived = false)
    {
        return await context.Others
            .Include(x => x.Images)
            .Where(x => includeArchived || !x.IsArchived)
            .ToListAsync();
    }

    public async Task<PaginatedResult<Other>> GetOthers(PagingParams pagingParams, bool includeArchived = false)
    {
        var query = context.Others
            .Include(x => x.Images)
            .Where(x => includeArchived || !x.IsArchived)
            .AsQueryable();

        if (!string.IsNullOrEmpty(pagingParams.Search))
        {
            query = query.Where(x => x.Name.ToLower().Contains(pagingParams.Search.ToLower()));
        }

        return await PaginationHelper.CreateAsync(query, pagingParams.PageNumber, pagingParams.PageSize);
    }

    public async Task<OtherImage?> FindImageByPublicIdAsync(string publicId)
    {
        return await context.OtherImages.FirstOrDefaultAsync(x => x.PublicId == publicId);
    }

    public async Task<bool> DeleteImageByPublicIdAsync(string publicId)
    {
        var image = await context.OtherImages.FirstOrDefaultAsync(x => x.PublicId == publicId);
        if (image is null) return false;

        context.OtherImages.Remove(image);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateOther(string id, Other other, IEnumerable<OtherImage>? newImages)
    {
        var currentOther = await context.Others
            .Include(x => x.Images)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (currentOther is null || id != other.Id) return false;

        currentOther.Name = other.Name;
        currentOther.Price = other.Price;
        currentOther.Quantity = other.Quantity;

        var imagesToAdd = newImages?.ToList() ?? [];
        if (imagesToAdd.Count > 0)
        {
            if (!currentOther.Images.Any(x => x.IsMain))
            {
                imagesToAdd[0].IsMain = true;
            }

            context.OtherImages.AddRange(imagesToAdd);
        }

        return await context.SaveChangesAsync() > 0;
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

    public async Task<bool> SetMainPhoto(string otherId, string publicId)
    {
        var other = await context.Others
            .Include(x => x.Images)
            .FirstOrDefaultAsync(x => x.Id == otherId);
        if (other is null) return false;

        var image = other.Images.FirstOrDefault(x => x.PublicId == publicId);
        if (image is null) return false;

        image.IsMain = true;
        foreach (var otherImage in other.Images.Where(x => x.Id != image.Id))
        {
            otherImage.IsMain = false;
        }

        return await context.SaveChangesAsync() > 0;
    }
}
