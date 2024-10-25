
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staff
{
    public interface IStaffRepository : IRepository<StaffProfile, StaffGuid>
    {
        Task<List<StaffProfile>> GetByUsernameAsync(string username);
        Task<StaffProfile> GetByStaffIDAsync(string staffId);
        Task<StaffProfile> UpdateAsync(StaffProfile obj);
    }
}