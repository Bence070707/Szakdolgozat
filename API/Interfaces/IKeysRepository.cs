using System;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IKeysRepository
{
    Task<PaginatedResult<Key>> GetKeysAsync(PagingParams pagingParams, bool includeArchived = false);
    Task<IReadOnlyList<Key>> GetAllKeysAsync(bool includeArchived = false);
    Task<Key?> FindKeyByIdAsync(string id);
    Task<bool> UpdateKey(string id, Key updatedKey, bool isAdmin, string userId);
    Task<bool> ArchiveKeyAsync(string id);
    Task<bool> UnarchiveKeyAsync(string id);
}
