using API.DTOs;

namespace API.Interfaces;

public interface ISalesRepository
{
    Task CreateSaleAsnyc(CreateSaleDTO createSaleDTO, string userId);
}
