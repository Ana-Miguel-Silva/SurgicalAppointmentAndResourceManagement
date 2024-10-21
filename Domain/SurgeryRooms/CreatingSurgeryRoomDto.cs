using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.SurgeryRooms;

    public class CreatingSurgeryRoomDto
    {

        public string Type { get;  set; }

        public int Capacity { get;  set; }

        public List<string> AssignedEquipment { get;  set; }

        public string Status { get;  set; }

        public List<Slot> MaintenanceSlots { get;  set; }

        public CreatingSurgeryRoomDto(string Type, int Capacity, List<string> AssignedEquipment, List<Slot> MaintenanceSlots)
        {
            this.Type = Type;
            this.Capacity = Capacity;
            this.AssignedEquipment = AssignedEquipment;
            this.Status = CurrentStatus.AVAILABLE;
            this.MaintenanceSlots = MaintenanceSlots;
        }

    }