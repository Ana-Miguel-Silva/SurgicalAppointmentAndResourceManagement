using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.RoomTypess;


namespace DDDSample1.ApplicationService.SurgeryRooms
{
    public class SurgeryRoomService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISurgeryRoomRepository _repo;
        private readonly IAppointmentRepository _appointmentRepository;
        private readonly IRoomTypesRepository _roomTypeRepository;

        public SurgeryRoomService(IUnitOfWork unitOfWork, ISurgeryRoomRepository repo, IAppointmentRepository appointmentRepository, IRoomTypesRepository roomTypeRepository)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._appointmentRepository = appointmentRepository;
            this._roomTypeRepository = roomTypeRepository;
        }

        public async Task<List<SurgeryRoomDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();

            List<SurgeryRoomDto> listDto = list.ConvertAll<SurgeryRoomDto>(surgeryRoom =>
                new(surgeryRoom.Id.AsGuid(), surgeryRoom.RoomNumber, surgeryRoom.Type, surgeryRoom.Capacity, surgeryRoom.AssignedEquipment, surgeryRoom.CurrentStatus, surgeryRoom.MaintenanceSlots));

            return listDto;
        }

        public async Task<List<SurgeryRoomUIDto>> GetAllUIAsync()
        {
            var list = await this._repo.GetAllAsync();

            List<SurgeryRoomDto> listDto = list.ConvertAll<SurgeryRoomDto>(surgeryRoom =>
                new(surgeryRoom.Id.AsGuid(), surgeryRoom.RoomNumber, surgeryRoom.Type, surgeryRoom.Capacity, surgeryRoom.AssignedEquipment, surgeryRoom.CurrentStatus, surgeryRoom.MaintenanceSlots));

            var UIList = await Dto_to_UIDto(listDto);

            return UIList;
        }

        public async Task<SurgeryRoomDto> GetByIdAsync(SurgeryRoomId id)
        {
            var surgeryRoom = await this._repo.GetByIdAsync(id);

            if (surgeryRoom == null)
                return null;

            return new SurgeryRoomDto(surgeryRoom.Id.AsGuid(), surgeryRoom.RoomNumber, surgeryRoom.Type, surgeryRoom.Capacity, surgeryRoom.AssignedEquipment, surgeryRoom.CurrentStatus, surgeryRoom.MaintenanceSlots);
        }

        public async Task<SurgeryRoomDto> AddAsync(CreatingSurgeryRoomDto dto)
        {
            CheckStatus(dto.Status);
            await checkRoomTypeAsync(dto.Type);

            List<Slot> converted = [];
            foreach (var slot in dto.MaintenanceSlots)
            {
                var convertedSLot = new Slot(slot.Start, slot.End);
                converted.Add(convertedSLot);
            }

            var surgeryRoom = new SurgeryRoom(dto.RoomNumber, dto.Type, dto.Capacity, dto.AssignedEquipment, dto.Status, converted);


            await this._repo.AddAsync(surgeryRoom);

            await this._unitOfWork.CommitAsync();

            return new SurgeryRoomDto(surgeryRoom.Id.AsGuid(), surgeryRoom.RoomNumber, surgeryRoom.Type, surgeryRoom.Capacity, surgeryRoom.AssignedEquipment, surgeryRoom.CurrentStatus, surgeryRoom.MaintenanceSlots);
        }

        public async Task<SurgeryRoomDto> UpdateAsync(SurgeryRoomDto dto)
        {
            CheckStatus(dto.Status);

            var surgeryRoom = await this._repo.GetByIdAsync(new SurgeryRoomId(dto.Id));

            if (surgeryRoom == null)
                return null;

            surgeryRoom.ChangeCurrentStatus(dto.Status);

            await this._unitOfWork.CommitAsync();

            return new SurgeryRoomDto(surgeryRoom.Id.AsGuid(), surgeryRoom.RoomNumber, surgeryRoom.Type, surgeryRoom.Capacity, surgeryRoom.AssignedEquipment, surgeryRoom.CurrentStatus, surgeryRoom.MaintenanceSlots);
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

        private async Task<RoomTypes> checkRoomTypeAsync(RTId roomTypeId)
        {
            Console.WriteLine("roomTypeId: " + roomTypeId.Value);
            Console.WriteLine("XXXXXXXXXXXXXXXXXX\n\n\n\n\n\n");
            var category = await _roomTypeRepository.GetByIdAsync(roomTypeId);
            if (category == null)
                throw new BusinessRuleValidationException("Invalid RoomType Id.");
            return category;
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

        private async Task<List<SurgeryRoomUIDto>> Dto_to_UIDto(List<SurgeryRoomDto> list)
        {
            var listDto = new List<SurgeryRoomUIDto>();
            foreach (var surgeryRoom in list)
            {
                var roomType = await this._roomTypeRepository.GetByIdAsync(surgeryRoom.Type);
                if (roomType.SurgerySuitable == true)
                    listDto.Add(new SurgeryRoomUIDto(surgeryRoom.Id, surgeryRoom.RoomNumber, roomType.Code.Value));
            }

            return listDto;
        }

    }
}