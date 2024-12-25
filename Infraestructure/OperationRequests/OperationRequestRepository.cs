using DDDSample1.Domain.OperationRequests;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.OperationRequests
{
    public class OperationRequestRepository : BaseRepository<OperationRequest, OperationRequestId>,IOperationRequestRepository
    {
        private readonly DDDSample1DbContext _context;
        public OperationRequestRepository(DDDSample1DbContext context):base(context.OperationRequests)
        {
           _context = context;
        }

        public async Task<List<OperationRequest>> GetAllNotScheduledAsync()
        {
            return await _context.OperationRequests
            .Where(op => op.Active == true)
            .ToListAsync();
        }
    }
}