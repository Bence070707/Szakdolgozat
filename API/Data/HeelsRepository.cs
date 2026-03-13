using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class HeelsRepository(AppDbContext context) : IHeelsRepository
{
    public async Task<Heel?> FindHeelById(string id)
    {
        return await context.Heels
            .Include(x => x.Images)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<IReadOnlyList<Heel>> GetAllHeelsAsync(bool includeArchived = false)
    {
        return await context.Heels
            .Include(x => x.Images)
            .Where(x => includeArchived || !x.IsArchived)
            .ToListAsync();
    }

    public async Task<PaginatedResult<Heel>> GetHeels(PagingParams pagingParams, bool includeArchived = false)
    {
        var query = context.Heels
            .Include(x => x.Images)
            .Where(x => includeArchived || !x.IsArchived)
            .AsQueryable();

        if (!string.IsNullOrEmpty(pagingParams.Search))
        {
            query = query.Where(x => x.Code.ToLower().Contains(pagingParams.Search.ToLower()));
        }

        return await PaginationHelper.CreateAsync(query, pagingParams.PageNumber, pagingParams.PageSize);
    }

    public async Task<HeelImage?> FindImageByPublicIdAsync(string publicId)
    {
        return await context.HeelImages.FirstOrDefaultAsync(x => x.PublicId == publicId);
    }

    public async Task<bool> DeleteImageByPublicIdAsync(string publicId)
    {
        var image = await context.HeelImages.FirstOrDefaultAsync(x => x.PublicId == publicId);
        if (image is null) return false;

        context.HeelImages.Remove(image);
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<bool> UpdateHeel(string id, Heel updatedHeel, IEnumerable<HeelImage>? newImages)
    {
        var heel = await context.Heels
            .Include(x => x.Images)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (heel is null || id != updatedHeel.Id) return false;

        heel.Price = updatedHeel.Price;
        heel.Quantity = updatedHeel.Quantity;

        var imagesToAdd = newImages?.ToList() ?? [];
        if (imagesToAdd.Count > 0)
        {
            if (!heel.Images.Any(x => x.IsMain))
            {
                imagesToAdd[0].IsMain = true;
            }

            context.HeelImages.AddRange(imagesToAdd);
        }

        return await context.SaveChangesAsync() > 0;
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

    public async Task<string?> CreateHeel(CreateHeelDto createHeelDto)
    {
        var newHeel = new Heel
        {
            Code = createHeelDto.Code,
            Quantity = createHeelDto.Quantity,
            Price = createHeelDto.Price
        };

        context.Heels.Add(newHeel);
        var result = await context.SaveChangesAsync() > 0;

        if (result) return newHeel.Id;
        return null;
    }

    public async Task<bool> SetMainPhoto(string heelId, string publicId)
    {
        var heel = await context.Heels
            .Include(x => x.Images)
            .FirstOrDefaultAsync(x => x.Id == heelId);
        if (heel is null) return false;

        var image = heel.Images.FirstOrDefault(x => x.PublicId == publicId);
        if (image is null) return false;

        image.IsMain = true;
        foreach (var otherImage in heel.Images.Where(x => x.Id != image.Id))
        {
            otherImage.IsMain = false;
        }

        return await context.SaveChangesAsync() > 0;
    }
}
