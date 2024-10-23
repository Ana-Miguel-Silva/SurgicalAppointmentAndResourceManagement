
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staff
{
    public interface IStaffRepository : IRepository<StaffProfile, StaffId>
    {
        Task<List<StaffProfile>> GetByUsernameAsync(string username);
    }
}