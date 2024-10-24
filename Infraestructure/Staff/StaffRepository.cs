using DDDSample1.Domain.Staff;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.Staff
{
    public class StaffRepository : BaseRepository<StaffProfile, StaffGuid>, IStaffRepository
    {
        private readonly DDDSample1DbContext _context;

        public StaffRepository(DDDSample1DbContext context) : base(context.StaffProfiles)
        {
            _context = context;

        }

        public async Task<List<StaffProfile>> GetByUsernameAsync(string email)
        {
            return await _context.StaffProfiles
                .Where(s => s.Email.ToString().Contains(email))
                .ToListAsync();
        }

    }
}