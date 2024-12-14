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
            .Where(s => s.Email.FullEmail.Contains(email))
            .ToListAsync();
        }

        public async Task<StaffProfile> GetByStaffIDAsync(string StaffId)
        {
            return await _context.StaffProfiles
            .Where(s => s.StaffId.Equals(StaffId))
            .FirstOrDefaultAsync();
        }

         public async Task<StaffProfile> GetByEmailAsync(string email)
        {
            var staffs = await _context.StaffProfiles.ToListAsync();

            return staffs.FirstOrDefault(p => p.Email.FullEmail.Contains(email));
        }
        
        public async Task<StaffProfile> UpdateAsync(StaffProfile obj){
            var existing = await _context.StaffProfiles.FindAsync(obj.Id);
            
            if (existing == null)
            {
                return null;
            }

            _context.Entry(existing).CurrentValues.SetValues(obj);
            await _context.SaveChangesAsync();

            return existing;
        }
    }
}