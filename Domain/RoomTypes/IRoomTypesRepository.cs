
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.RoomTypess
{
    public interface IRoomTypesRepository : IRepository<RoomTypes, RTId>
    {
        //Task<List<RoomTypes>> GetByRoomTypesnameAsync(string RoomTypesname);

        Task<List<RoomTypes>> GetSurgerySuitableActiveAsync();

        Task<RoomTypes> GetbyIdAsync(string id);
    }

    
}