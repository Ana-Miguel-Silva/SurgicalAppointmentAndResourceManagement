using DDDSample1.Domain.RoomTypess;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.RoomTypess
{
    public class RoomTypesRepository : BaseRepository<RoomTypes, RTId>, IRoomTypesRepository
    {
        private readonly DDDSample1DbContext _context;

        public RoomTypesRepository(DDDSample1DbContext context) : base(context.RoomTypes)
        {
            _context = context;
        }

        // Método para buscar RoomTypes ativos e adequados para cirurgia
        public async Task<List<RoomTypes>> GetSurgerySuitableActiveAsync()
        {
            return await _context.RoomTypes
                .Where(r => r.SurgerySuitable && r.SurgerySuitable)
                .ToListAsync();
        }

        // Método para buscar RoomTypes por email (utilizando a propriedade do objeto email)
        public async Task<RoomTypes> GetbyIdAsync(string id)
        {
            return await _context.RoomTypes
                .FirstOrDefaultAsync(r => r.Id.Equals(id));
        }
    }
}
