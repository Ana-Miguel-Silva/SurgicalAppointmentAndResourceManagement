using System.ComponentModel;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;

namespace DDDSample1.Domain.Staff
{
    public class StaffService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStaffRepository _repo;

        public StaffService(IUnitOfWork unitOfWork, IStaffRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<StaffDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();

            List<StaffDto> listDto = list.ConvertAll<StaffDto>(staff =>
                new(staff.Id.AsGuid(), staff.Username, staff.Email, staff.PhoneNumber, staff.Specialization));

            return listDto;
        }

        public async Task<StaffDto> GetByIdAsync(StaffId id)
        {
            var staff = await this._repo.GetByIdAsync(id);

            if (staff == null)
                return null;
    
            return new StaffDto(staff.Id.AsGuid(), staff.Username, staff.Email, staff.PhoneNumber, staff.Specialization);
        }

        public async Task<StaffDto> AddAsync(CreatingStaffDto dto)
        {
            var emailObject = new Email(dto.Email);

            var user = new StaffProfile(dto.Username, emailObject, new PhoneNumber(dto.PhoneNumber), dto.Specialization);

            await this._repo.AddAsync(user);

            await this._unitOfWork.CommitAsync();
     

            if (user == null)
                return null;
                
            return new StaffDto(user.Id.AsGuid(), user.Username, user.Email, user.PhoneNumber, user.Specialization);
        }

        public async Task<StaffDto> UpdateAsync(StaffDto dto)
        {

            var staff = await this._repo.GetByIdAsync(new StaffId(dto.Id));

            if (staff == null)
                return null;


            await this._unitOfWork.CommitAsync();

            return new StaffDto(staff.Id.AsGuid(), staff.Username, staff.Email, staff.PhoneNumber, staff.Specialization);
        }

        public async Task<StaffDto> InactivateAsync(StaffId id)
        {
            var staff = await this._repo.GetByIdAsync(id);

            if (staff == null)
                return null;

            staff.MarkAsInative();

            await this._unitOfWork.CommitAsync();

            return new StaffDto(staff.Id.AsGuid(), staff.Username, staff.Email, staff.PhoneNumber, staff.Specialization);
        }

        public async Task<StaffDto> DeleteAsync(StaffId id)
        {
            var staff = await this._repo.GetByIdAsync(id);

            if (staff == null)
                return null;

            if (staff.Active)
                throw new BusinessRuleValidationException("It is not possible to delete an active user.");

            this._repo.Remove(staff);
            await this._unitOfWork.CommitAsync();

             return new StaffDto(staff.Id.AsGuid(), staff.Username, staff.Email, staff.PhoneNumber, staff.Specialization);
        }

    }
}