using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IHeelsRepository
{
    Task<PaginatedResult<Heel>> GetHeels(PagingParams pagingParams);
    Task<IReadOnlyList<Heel>> GetAllHeelsAsync();
    Task<Heel?> FindHeelById(string id);
    Task UpdateHeel(Heel heel);
}
