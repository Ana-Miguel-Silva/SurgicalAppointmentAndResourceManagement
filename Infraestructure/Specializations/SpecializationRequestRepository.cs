using DDDSample1.Domain.Specializations;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.Specializations
{
    public class SpecializationRepository : BaseRepository<Specialization, SpecializationId>,ISpecializationRepository
    {

        private readonly DDDSample1DbContext _context;
        public SpecializationRepository(DDDSample1DbContext context):base(context.Specializations)
        {
           _context = context;
        }

        public async Task<List<Specialization>> GetByNameAsync(string name)
        {
            return await _context.Specializations
            .Where(op => op.SpecializationName.Contains(name))
            .ToListAsync();
        }
    }
}