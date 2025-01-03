using System.ComponentModel;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Specializations;

namespace DDDSample1.ApplicationService.Staff
{
    public class StaffService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IStaffRepository _repo;
        private readonly ISpecializationRepository _specializationRepository;

        public StaffService(IUnitOfWork unitOfWork, IStaffRepository repo, ISpecializationRepository specializationRepository)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._specializationRepository = specializationRepository;
        }

        public async Task<List<StaffDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();

            List<StaffDto> listDto = list.ConvertAll<StaffDto>(staff =>
                new(staff.Id.AsGuid(), staff.Name, staff.Email, staff.PhoneNumber, staff.Role, staff.Specialization, staff.AvailabilitySlots, staff.StaffId, staff.LicenseNumber, staff.Active));

            return listDto;
        }
        public async Task<List<StaffDto>> GetAllFilteredAsync(string? id, string? name, string? license, string? phone, string? specialization, string? role, string? active)
        {
            var list = await this._repo.GetAllAsync();

            List<StaffDto> listDto = list.ConvertAll<StaffDto>(staff =>
                new(staff.Id.AsGuid(), staff.Name, staff.Email, staff.PhoneNumber, staff.Role, staff.Specialization, staff.AvailabilitySlots, staff.StaffId, staff.LicenseNumber, staff.Active));
            if (id != null) listDto = listDto.Where(x => x.StaffId.Contains(id)).ToList();
            if (name != null) listDto = listDto.Where(x => x.Name.GetFullName().ToLower().Equals(name.ToLower())).ToList();
            if (license != null) listDto = listDto.Where(x => x.LicenseNumber.Contains(license)).ToList();
            if (phone != null) listDto = listDto.Where(x => x.PhoneNumber.Number.Contains(phone)).ToList();
            if (specialization != null) listDto = listDto.Where(x => x.Specialization.Equals(specialization.ToUpper())).ToList();
            if (role != null) listDto = listDto.Where(x => x.Role.ToUpper().Equals(role.ToUpper())).ToList();
            if (active != null) { listDto = listDto.Where(x => x.Active.Equals(active)).ToList(); }
            //else{listDto = listDto.Where(x => x.Active.Equals(true)).ToList();}
            return listDto;
        }

        public async Task<StaffDto> GetByIdAsync(StaffGuid id)
        {
            var staff = await this._repo.GetByIdAsync(id);

            if (staff == null)
                return null;

            return new StaffDto(staff.Id.AsGuid(), staff.Name, staff.Email, staff.PhoneNumber, staff.Role, staff.Specialization, staff.AvailabilitySlots, staff.StaffId, staff.LicenseNumber, staff.Active);
        }

        public async Task<StaffDto> GetStaffByEmailAsync(string emailClaim)
        {
            var staff = await this._repo.GetByEmailAsync(emailClaim);

            if (staff == null)
            {
                return null;
            }

            return new StaffDto(staff.Id.AsGuid(), staff.Name, staff.Email, staff.PhoneNumber, staff.Role, staff.Specialization, staff.AvailabilitySlots, staff.StaffId, staff.LicenseNumber, staff.Active);
        }
        public async Task<StaffDto> GetByStaffIDAsync(string id)
        {
            var staff = await this._repo.GetByStaffIDAsync(id);

            if (staff == null)
                return null;

            return new StaffDto(staff.Id.AsGuid(), staff.Name, staff.Email, staff.PhoneNumber, staff.Role, staff.Specialization, staff.AvailabilitySlots, staff.StaffId, staff.LicenseNumber, staff.Active);
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
            if (!flag)
            {
                throw new BusinessRuleValidationException("Time Slots need to be multiples of 15 minutes.");
            }
            if (string.IsNullOrEmpty(dto.Name))
            {
                throw new BusinessRuleValidationException("Staff's name cannot be Empty.");
            }
            CheckRole(dto.Role);
            await CheckSpecialization(dto.Specialization);
            int baseID = GetAllFilteredAsync(null, null, null, null, null, dto.Role, null).Result.Count();
            char roleId = dto.Role[0];
            if (roleId != 'D' && roleId != 'N') roleId = 'O';
            string finalID = dto.Role[0] + DateTime.Now.Year.ToString() + baseID;
            var staff = new StaffProfile(new FullName(dto.Name), emailObject, new PhoneNumber(dto.PhoneNumber), dto.Role, dto.Specialization, converted, finalID, dto.License);

            await this._repo.AddAsync(staff);

            await this._unitOfWork.CommitAsync();


            if (staff == null)
                return null;

            return new StaffDto(staff.Id.AsGuid(), staff.Name, staff.Email, staff.PhoneNumber, staff.Role, staff.Specialization, converted, staff.StaffId, staff.LicenseNumber, staff.Active);
        }

        public async Task<StaffDto> UpdateAsync(string id, UpdateStaffDto dto)
        {

            var staff = await this._repo.GetByStaffIDAsync(id);

            if (staff == null)
                return null;
            if (dto.Email != null)
            {
                var newMail = new Email(dto.Email);
                if (staff.Email != newMail) staff.ChangeEmail(newMail);
            }
            if (dto.PhoneNumber != null)
            {
                var newPhone = new PhoneNumber(dto.PhoneNumber);
                if (staff.PhoneNumber != newPhone) staff.ChangePhone(newPhone);
            }
            //List<Slot> converted = [];
            //var flag = true;
            //foreach (var slot in dto.Slots)
            //{
            //    var convertedSLot = new Slot(slot.StartTime, slot.EndTime);
            //    if ((convertedSLot.timespan().TotalMinutes % 15) != 0) flag = false;
            //    converted.Add(convertedSLot);
            //}
            //if(!flag) return null;
            //staff.UpdateSlots(converted);
            //            staff.ChangeLicenseNumber(dto.LicenseNumber);
            if (dto.Specialization != null)
            {
                await CheckSpecialization(dto.Specialization);
                staff.UpdateSpecialization(dto.Specialization);
            }
            await this._unitOfWork.CommitAsync();

            //return new StaffDto(staff.Id.AsGuid(), staff.Name, staff.Email, staff.PhoneNumber, staff.Role, staff.Specialization, staff.AvailabilitySlots, staff.StaffId);
            return new StaffDto(staff.Id.AsGuid(), staff.Name, staff.Email, staff.PhoneNumber, staff.Role, staff.Specialization, staff.AvailabilitySlots, staff.StaffId, staff.LicenseNumber, staff.Active);
        }

        public async Task<StaffDto> AddSlots(string id, SlotDTO dto)
        {
            var staff = await this._repo.GetByStaffIDAsync(id);

            if (staff == null)
                return null;
            if (dto != null)
            {
                staff.AddSlots(dto.Slots);
            }

            await this._unitOfWork.CommitAsync();
            return new StaffDto(staff.Id.AsGuid(), staff.Name, staff.Email, staff.PhoneNumber, staff.Role, staff.Specialization, staff.AvailabilitySlots, staff.StaffId, staff.LicenseNumber, staff.Active);
        }

        public async Task<StaffDto> RemoveSlots(string id, SlotDTO dto)
        {
            var staff = await this._repo.GetByStaffIDAsync(id);

            if (staff == null)
                return null;
            if (dto != null)
            {
                staff.RemoveSlots(dto.Slots);
            }


            await this._unitOfWork.CommitAsync();
            return new StaffDto(staff.Id.AsGuid(), staff.Name, staff.Email, staff.PhoneNumber, staff.Role, staff.Specialization, staff.AvailabilitySlots, staff.StaffId, staff.LicenseNumber, staff.Active);
        }
        public async Task<StaffDto> InactivateAsync(string id)
        {
            var staff = await this._repo.GetByStaffIDAsync(id);

            if (staff == null)
                return null;

            staff.MarkAsInative();

            await this._unitOfWork.CommitAsync();

            return new StaffDto(staff.Id.AsGuid(), staff.Name, staff.Email, staff.PhoneNumber, staff.Role, staff.Specialization, staff.AvailabilitySlots, staff.StaffId, staff.LicenseNumber, staff.Active);
        }

        public async Task<StaffDto> DeleteAsync(string id)
        {
            var staff = await this._repo.GetByStaffIDAsync(id);

            if (staff == null)
                return null;

            if (staff.Active)
                throw new BusinessRuleValidationException("It is not possible to delete an active staff.");

            this._repo.Remove(staff);
            await this._unitOfWork.CommitAsync();

            return new StaffDto(staff.Id.AsGuid(), staff.Name, staff.Email, staff.PhoneNumber, staff.Role, staff.Specialization, staff.AvailabilitySlots, staff.StaffId, staff.LicenseNumber, staff.Active);
        }
        private static void CheckRole(String role)
        {
            if (!Role.IsValid(role.ToUpper()) || role.ToUpper().Equals("ADMIN") || role.ToUpper().Equals("PATIENT"))
                throw new BusinessRuleValidationException("Invalid Role.");
        }
        private async Task CheckSpecialization(String specialization)
        {
            var specializations = await this._specializationRepository.GetAllSpecializationNamesAsync();

            if (!specializations.Contains(specialization.ToUpper()))
                throw new BusinessRuleValidationException("Invalid Specialization.");
        }

        public async Task<List<StaffUIDto>> GetAllUIAsync()
        {
            var list = await this._repo.GetAllAsync();

            List<StaffDto> listDto = list.ConvertAll<StaffDto>(staff =>
      new(staff.Id.AsGuid(), staff.Name, staff.Email, staff.PhoneNumber, staff.Role, staff.Specialization, staff.AvailabilitySlots, staff.StaffId, staff.LicenseNumber, staff.Active));

            var UIList = await Dto_to_UIDto(listDto);

            return UIList;
        }

        private async Task<List<StaffUIDto>> Dto_to_UIDto(List<StaffDto> list)
        {
            var listDto = new List<StaffUIDto>();
            foreach (var staff in list)
            {
                if (staff.Active)
                    listDto.Add(new StaffUIDto(staff.Id, staff.LicenseNumber, staff.Role, staff.Specialization));
            }

            return listDto;
        }
    }
}