using DDDSample1.Domain.Staff;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.Staff
{
    public class StaffRepository : BaseRepository<StaffProfile, StaffID>, IStaffRepository
    {
    
        public StaffRepository(DDDSample1DbContext context):base(context.StaffProfiles)
        {
           
        }


    }
}