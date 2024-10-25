using DDDSample1.Infrastructure.Shared;
using DDDSample1.Domain.OperationTypes;
using Microsoft.EntityFrameworkCore;


namespace DDDSample1.Infrastructure.OperationTypes
{
    public class OperationTypeRepository : BaseRepository<OperationType, OperationTypeId>,IOperationTypeRepository
    {
        private readonly DDDSample1DbContext _context;
        public OperationTypeRepository(DDDSample1DbContext context):base(context.OperationTypes)
        {
           _context = context;
        }

        public async Task<List<OperationType>> GetByNameAsync(string name)
        {
            return await _context.OperationTypes
            .Where(op => op.Name.Contains(name))
            .ToListAsync();
        }
    }
}