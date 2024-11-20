using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Domain.Appointments;


namespace DDDSample1.ApplicationService.SurgeryRooms
{
    public class SurgeryRoomService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISurgeryRoomRepository _repo;
        private readonly IAppointmentRepository _appointmentRepository;

        public SurgeryRoomService(IUnitOfWork unitOfWork, ISurgeryRoomRepository repo, IAppointmentRepository appointmentRepository)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._appointmentRepository = appointmentRepository;
        }

        public async Task<List<SurgeryRoomDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();

            List<SurgeryRoomDto> listDto = list.ConvertAll<SurgeryRoomDto>(surgeryRoom =>
                new(surgeryRoom.Id.AsGuid(), surgeryRoom.RoomNumber ,surgeryRoom.Type, surgeryRoom.Capacity, surgeryRoom.AssignedEquipment, surgeryRoom.CurrentStatus, surgeryRoom.MaintenanceSlots));

            return listDto;
        }

        public async Task<SurgeryRoomDto> GetByIdAsync(SurgeryRoomId id)
        {
            var surgeryRoom = await this._repo.GetByIdAsync(id);

            if (surgeryRoom == null)
                return null;

            return new SurgeryRoomDto(surgeryRoom.Id.AsGuid(), surgeryRoom.RoomNumber ,surgeryRoom.Type, surgeryRoom.Capacity, surgeryRoom.AssignedEquipment, surgeryRoom.CurrentStatus, surgeryRoom.MaintenanceSlots);
        }

        public async Task<SurgeryRoomDto> AddAsync(CreatingSurgeryRoomDto dto)
        {
            CheckStatus(dto.Status);

            List<Slot> converted = [];
            foreach (var slot in dto.MaintenanceSlots)
            {
                var convertedSLot = new Slot(slot.Start, slot.End);
                converted.Add(convertedSLot);
            }

            var surgeryRoom = new SurgeryRoom(dto.RoomNumber, dto.Type, dto.Capacity, dto.AssignedEquipment, dto.Status, converted);


            await this._repo.AddAsync(surgeryRoom);

            await this._unitOfWork.CommitAsync();

            return new SurgeryRoomDto(surgeryRoom.Id.AsGuid(),surgeryRoom.RoomNumber , surgeryRoom.Type, surgeryRoom.Capacity, surgeryRoom.AssignedEquipment, surgeryRoom.CurrentStatus, surgeryRoom.MaintenanceSlots);
        }

        public async Task<SurgeryRoomDto> UpdateAsync(SurgeryRoomDto dto)
        {
            CheckStatus(dto.Status);

            var surgeryRoom = await this._repo.GetByIdAsync(new SurgeryRoomId(dto.Id));

            if (surgeryRoom == null)
                return null;

            surgeryRoom.ChangeCurrentStatus(dto.Status);

            await this._unitOfWork.CommitAsync();

            return new SurgeryRoomDto(surgeryRoom.Id.AsGuid(),surgeryRoom.RoomNumber , surgeryRoom.Type, surgeryRoom.Capacity, surgeryRoom.AssignedEquipment, surgeryRoom.CurrentStatus, surgeryRoom.MaintenanceSlots);
        }

        public async Task<SurgeryRoomDto> DeleteAsync(SurgeryRoomId id)
        {
            var surgeryRoom = await this._repo.GetByIdAsync(id);

            if (surgeryRoom == null)
                return null;

            this._repo.Remove(surgeryRoom);
            await this._unitOfWork.CommitAsync();

            return new SurgeryRoomDto(surgeryRoom.Id.AsGuid(), surgeryRoom.RoomNumber, surgeryRoom.Type, surgeryRoom.Capacity, surgeryRoom.AssignedEquipment, surgeryRoom.CurrentStatus, surgeryRoom.MaintenanceSlots);
        }

        private static void CheckStatus(String status)
        {
            if (!RoomStatus.IsValid(status.ToUpper()))
                throw new BusinessRuleValidationException("Invalid Status.");
        }

        public async Task<bool> IsRoomAvailable(SurgeryRoomId id, DateTime date, int duration)
        {
            var surgeryRoom = await this._repo.GetByIdAsync(id);

            if (surgeryRoom == null)
                return false;

            var appointments = await this._appointmentRepository.GetByRoomAsync(id.Value);

            foreach (var appointment in appointments)
            {   
                if (appointment.Date.StartTime.Day == date.Date.Day || appointment.Date.EndTime.Day == date.Date.Day)
                {
                    if (appointment.Date.StartTime.Hour <= date.Hour && appointment.Date.EndTime.Hour > date.Hour)
                        return false;
                }
            }

            return true;
        }

    }
}