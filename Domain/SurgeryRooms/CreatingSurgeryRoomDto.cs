using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.SurgeryRooms;

    public class CreatingSurgeryRoomDto
    {
        public int RoomNumber { get;  set; }
        public string Type { get;  set; }

        public int Capacity { get;  set; }

        public List<string> AssignedEquipment { get;  set; }

        public string Status { get;  set; }

        public List<DateDTO> MaintenanceSlots { get;  set; }

        public CreatingSurgeryRoomDto(int number, string type, int capacity, List<string> assignedEquipment, List<DateDTO> maintenanceSlots)
        {
            this.RoomNumber = number;
            this.Type = type;
            this.Capacity = capacity;
            this.AssignedEquipment = assignedEquipment;
            this.Status = RoomStatus.AVAILABLE;
            this.MaintenanceSlots = maintenanceSlots;
        }

    }