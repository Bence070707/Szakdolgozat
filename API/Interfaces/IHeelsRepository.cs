using API.Entities;
using API.DTOs;
using API.Helpers;

namespace API.Interfaces;

public interface IHeelsRepository
{
    Task<PaginatedResult<Heel>> GetHeels(PagingParams pagingParams, bool includeArchived = false);
    Task<IReadOnlyList<Heel>> GetAllHeelsAsync(bool includeArchived = false);
    Task<Heel?> FindHeelById(string id);
    Task<HeelImage?> FindImageByPublicIdAsync(string publicId);
    Task<bool> DeleteImageByPublicIdAsync(string publicId);
    Task<bool> UpdateHeel(string id, Heel updatedHeel, IEnumerable<HeelImage>? newImages);
    Task<bool> ArchiveHeelAsync(string id);
    Task<bool> UnarchiveHeelAsync(string id);
    Task<string?> CreateHeel(CreateHeelDto createHeelDto);
    Task<bool> SetMainPhoto(string heelId, string publicId);
}
