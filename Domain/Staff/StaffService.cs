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
                new(staff.Id.AsGuid(), staff.Username, staff.Email, staff.PhoneNumber));

            return listDto;
        }

        public async Task<StaffDto> GetByIdAsync(StaffID id)
        {
            var user = await this._repo.GetByIdAsync(id);

            if (user == null)
                return null;
    
            return new StaffDto(user.Id.AsGuid(), user.Username, user.Email, user.PhoneNumber);
        }

        public async Task<StaffDto> AddAsync(CreatingStaffDto dto)
        {
            var emailObject = new Email(dto.Email);

            var user = new StaffProfile(dto.Username, emailObject, new PhoneNumber(dto.PhoneNumber));

            await this._repo.AddAsync(user);

            await this._unitOfWork.CommitAsync();
     

            if (user == null)
                return null;
                
            return new StaffDto(user.Id.AsGuid(), user.Username, user.Email, user.PhoneNumber);
        }

        public async Task<StaffDto> UpdateAsync(StaffDto dto)
        {

            var user = await this._repo.GetByIdAsync(new StaffID(dto.Id));

            if (user == null)
                return null;


            await this._unitOfWork.CommitAsync();

            return new StaffDto(user.Id.AsGuid(), user.Username, user.Email, user.PhoneNumber);
        }

        public async Task<StaffDto> InactivateAsync(StaffID id)
        {
            var user = await this._repo.GetByIdAsync(id);

            if (user == null)
                return null;

            user.MarkAsInative();

            await this._unitOfWork.CommitAsync();

            return new StaffDto(user.Id.AsGuid(), user.Username, user.Email, user.PhoneNumber);
        }

        public async Task<StaffDto> DeleteAsync(StaffID id)
        {
            var user = await this._repo.GetByIdAsync(id);

            if (user == null)
                return null;

            if (user.Active)
                throw new BusinessRuleValidationException("It is not possible to delete an active user.");

            this._repo.Remove(user);
            await this._unitOfWork.CommitAsync();

            return new StaffDto(user.Id.AsGuid(), user.Username, user.Email, user.PhoneNumber);
        }

    }
}