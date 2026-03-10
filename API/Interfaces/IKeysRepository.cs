using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IKeysRepository
{
    Task<PaginatedResult<Key>> GetKeysAsync(PagingParams pagingParams, bool includeArchived = false);
    Task<IReadOnlyList<Key>> GetAllKeysAsync(bool includeArchived = false);
    Task<Key?> FindKeyByIdAsync(string id);
    Task<KeyImage?> FindImageByPublicIdAsync(string publicId);
    Task<bool> DeleteImageByPublicIdAsync(string publicId);
    Task<bool> UpdateKey(string id, Key updatedKey, IEnumerable<KeyImage>? newImages, bool isAdmin, string userId);
    Task<bool> ArchiveKeyAsync(string id);
    Task<bool> UnarchiveKeyAsync(string id);
    Task<string?> CreateKey(CreateKeyDto createKeyDto);
    Task<bool> SaveAllASync();
}
