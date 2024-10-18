
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staff
{
    public interface IStaffRepository : IRepository<StaffProfile, LicenseNumber>
    {
    }
}