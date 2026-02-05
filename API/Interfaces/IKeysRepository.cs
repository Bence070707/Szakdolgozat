using System;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IKeysRepository
{
    Task<PaginatedResult<Key>> GetKeysAsync(PagingParams pagingParams);
    Task<IReadOnlyList<Key>> GetAllKeysAsync();
    Task<Key?> FindKeyByIdAsync(string id);
    Task UpdateKey(Key key);
}
