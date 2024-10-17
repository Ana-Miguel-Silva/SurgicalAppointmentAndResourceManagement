using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.SurgeryRooms;

    public class CreatingSurgeryRoomDto
    {

        public string Type { get; private set; }

        public int Capacity { get; private set; }

        public List<string> AssignedEquipment { get; private set; }

        public string Status { get; private set; }

        public List<Slot> MaintenanceSlots { get; private set; }

        public CreatingSurgeryRoomDto(string Type, int Capacity, List<string> AssignedEquipment, List<Slot> MaintenanceSlots)
        {
            this.Type = Type;
            this.Capacity = Capacity;
            this.AssignedEquipment = AssignedEquipment;
            this.Status = CurrentStatus.AVAILABLE;
            this.MaintenanceSlots = MaintenanceSlots;
        }

    }