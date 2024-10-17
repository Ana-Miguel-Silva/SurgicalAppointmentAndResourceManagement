using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.SurgeryRooms
{
    public class SurgeryRoomService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISurgeryRoomRepository _repo;

        public SurgeryRoomService(IUnitOfWork unitOfWork, ISurgeryRoomRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<SurgeryRoomDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();

            List<SurgeryRoomDto> listDto = list.ConvertAll<SurgeryRoomDto>(surgeryRoom =>
                new(surgeryRoom.Id.AsGuid(), surgeryRoom.Type, surgeryRoom.Capacity, surgeryRoom.AssignedEquipment, surgeryRoom.Status, surgeryRoom.MaintenanceSlots));

            return listDto;
        }

        public async Task<SurgeryRoomDto> GetByIdAsync(SurgeryRoomId id)
        {
            var surgeryRoom = await this._repo.GetByIdAsync(id);

            if (surgeryRoom == null)
                return null;

            return new SurgeryRoomDto(surgeryRoom.Id.AsGuid(), surgeryRoom.Type, surgeryRoom.Capacity, surgeryRoom.AssignedEquipment, surgeryRoom.Status, surgeryRoom.MaintenanceSlots);
        }

        public async Task<SurgeryRoomDto> AddAsync(CreatingSurgeryRoomDto dto)
        {
            CheckStatus(dto.Status);

            var surgeryRoom = new SurgeryRoom(dto.Type, dto.Capacity, dto.AssignedEquipment, dto.Status, dto.MaintenanceSlots);

            await this._repo.AddAsync(surgeryRoom);

            await this._unitOfWork.CommitAsync();

            return new SurgeryRoomDto(surgeryRoom.Id.AsGuid(), surgeryRoom.Type, surgeryRoom.Capacity, surgeryRoom.AssignedEquipment, surgeryRoom.Status, surgeryRoom.MaintenanceSlots);
        }

        public async Task<SurgeryRoomDto> UpdateAsync(SurgeryRoomDto dto)
        {
            CheckStatus(dto.Status);

            var surgeryRoom = await this._repo.GetByIdAsync(new SurgeryRoomId(dto.Id));

            if (surgeryRoom == null)
                return null;

            surgeryRoom.ChangeCurrentStatus(dto.Status);

            await this._unitOfWork.CommitAsync();

            return new SurgeryRoomDto(surgeryRoom.Id.AsGuid(), surgeryRoom.Type, surgeryRoom.Capacity, surgeryRoom.AssignedEquipment, surgeryRoom.Status, surgeryRoom.MaintenanceSlots);
        }

        public async Task<SurgeryRoomDto> InactivateAsync(SurgeryRoomId id)
        {
            var surgeryRoom = await this._repo.GetByIdAsync(id);

            if (surgeryRoom == null)
                return null;

            surgeryRoom.MarkAsInactive();

            await this._unitOfWork.CommitAsync();

            return new SurgeryRoomDto(surgeryRoom.Id.AsGuid(), surgeryRoom.Type, surgeryRoom.Capacity, surgeryRoom.AssignedEquipment, surgeryRoom.Status, surgeryRoom.MaintenanceSlots);
        }

        public async Task<SurgeryRoomDto> DeleteAsync(SurgeryRoomId id)
        {
            var surgeryRoom = await this._repo.GetByIdAsync(id);

            if (surgeryRoom == null)
                return null;

            if (surgeryRoom.Active)
                throw new BusinessRuleValidationException("It is not possible to delete an active surgery room.");

            this._repo.Remove(surgeryRoom);
            await this._unitOfWork.CommitAsync();

            return new SurgeryRoomDto(surgeryRoom.Id.AsGuid(), surgeryRoom.Type, surgeryRoom.Capacity, surgeryRoom.AssignedEquipment, surgeryRoom.Status, surgeryRoom.MaintenanceSlots);
        }

        private static void CheckStatus(String status)
        {
            if (CurrentStatus.IsValid(status.ToUpper()))
                throw new BusinessRuleValidationException("Invalid Status.");
        }

    }
}