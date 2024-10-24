using System.ComponentModel;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;

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
                new(staff.Id.AsGuid(), staff.Name, staff.Email, staff.PhoneNumber, staff.Role, staff.Specialization, staff.AvailabilitySlots, staff.StaffId));

            return listDto;
        }
        public async Task<List<StaffDto>> GetAllFilteredAsync(string? id, string? name, string? license, string? phone, string? specialization, string? role)
        {
            var list = await this._repo.GetAllAsync();

            List<StaffDto> listDto = list.ConvertAll<StaffDto>(staff =>
                new(staff.Id.AsGuid(), staff.Name, staff.Email, staff.PhoneNumber, staff.Role, staff.Specialization, staff.AvailabilitySlots, staff.StaffId));
            if (name != null) listDto = listDto.Where(x => x.Name.Equals(name)).ToList();
            //if (license != null) listDto = listDto.Where(x => x.LicenseNumber.Equals(license)).ToList();
            if (phone != null) listDto = listDto.Where(x => x.PhoneNumber.Equals(phone)).ToList();
            if (specialization != null) listDto = listDto.Where(x => x.Specialization.Equals(specialization)).ToList();
            if (role != null) listDto = listDto.Where(x => x.Role.ToUpper().Equals(role.ToUpper())).ToList();
            return listDto;
        }

        public async Task<StaffDto> GetByIdAsync(StaffGuid id)
        {
            var staff = await this._repo.GetByIdAsync(id);

            if (staff == null)
                return null;
    
            return new StaffDto(staff.Id.AsGuid(), staff.Name, staff.Email, staff.PhoneNumber, staff.Role, staff.Specialization, staff.AvailabilitySlots, staff.StaffId);
        }

        public async Task<StaffDto> AddAsync(CreatingStaffDto dto)
        {
            var emailObject = new Email(dto.Email);
            List<Slot> converted = [];
            var flag = true;
            foreach (var slot in dto.Slots)
            {
                var convertedSLot = new Slot(slot.Start, slot.End);
                if ((convertedSLot.timespan().TotalMinutes % 15) != 0) flag = false;
                converted.Add(convertedSLot);
            }
            if(!flag) converted = null;

            int baseID = GetAllFilteredAsync(null, null, null, null, null, dto.Role).Result.Count();
            char roleId = dto.Role[0];
            if(roleId!='D'&&roleId!='N') roleId='O';
            string finalID = dto.Role[0] + DateTime.Now.Year.ToString() + baseID;

            var staff = new StaffProfile(new FullName(dto.Name + finalID), emailObject, new PhoneNumber(dto.PhoneNumber), dto.Role, dto.Specialization, converted, finalID);

            await this._repo.AddAsync(staff);

            await this._unitOfWork.CommitAsync();
     

            if (staff == null)
                return null;
                
            return new StaffDto(staff.Id.AsGuid(), staff.Name, staff.Email, staff.PhoneNumber, staff.Role, staff.Specialization, converted, staff.StaffId);
        }

        public async Task<StaffDto> UpdateAsync(StaffDto dto)
        {

            var staff = await this._repo.GetByIdAsync(new StaffGuid(dto.Id));

            if (staff == null)
                return null;


            await this._unitOfWork.CommitAsync();

            return new StaffDto(staff.Id.AsGuid(), staff.Name, staff.Email, staff.PhoneNumber, staff.Role, staff.Specialization, staff.AvailabilitySlots, staff.StaffId);
        }

        public async Task<StaffDto> InactivateAsync(StaffGuid id)
        {
            var staff = await this._repo.GetByIdAsync(id);

            if (staff == null)
                return null;

            staff.MarkAsInative();

            await this._unitOfWork.CommitAsync();

            return new StaffDto(staff.Id.AsGuid(), staff.Name, staff.Email, staff.PhoneNumber, staff.Role, staff.Specialization, staff.AvailabilitySlots, staff.StaffId);
        }

        public async Task<StaffDto> DeleteAsync(StaffGuid id)
        {
            var staff = await this._repo.GetByIdAsync(id);

            if (staff == null)
                return null;

            if (staff.Active)
                throw new BusinessRuleValidationException("It is not possible to delete an active staff.");

            this._repo.Remove(staff);
            await this._unitOfWork.CommitAsync();

             return new StaffDto(staff.Id.AsGuid(), staff.Name, staff.Email, staff.PhoneNumber, staff.Role, staff.Specialization, staff.AvailabilitySlots, staff.StaffId);
        }
        private static void CheckRole(String role)
        {
            if (!Role.IsValid(role.ToUpper()) || role.ToUpper().Equals("ADMIN") || role.ToUpper().Equals("PATIENT"))
                throw new BusinessRuleValidationException("Invalid Role.");
        }
    }
}