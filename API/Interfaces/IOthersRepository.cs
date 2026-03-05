using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IOthersRepository
{
    Task<PaginatedResult<Other>> GetOthers(PagingParams pagingParams, bool includeArchived = false);
    Task<IReadOnlyList<Other>> GetAllOthersAsync(bool includeArchived = false);
    Task<Other?> FindOtherById(string id);
    Task UpdateOther(Other other);
    Task<bool> ArchiveOtherAsync(string id);
    Task<bool> UnarchiveOtherAsync(string id);
    Task<string?> CreateOther(CreateOtherDto createOtherDto);
}
