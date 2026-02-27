using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IHeelsRepository
{
    Task<PaginatedResult<Heel>> GetHeels(PagingParams pagingParams, bool includeArchived = false);
    Task<IReadOnlyList<Heel>> GetAllHeelsAsync(bool includeArchived = false);
    Task<Heel?> FindHeelById(string id);
    Task UpdateHeel(Heel heel);
    Task<bool> ArchiveHeelAsync(string id);
    Task<bool> UnarchiveHeelAsync(string id);
}
