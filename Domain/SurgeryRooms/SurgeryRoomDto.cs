using DDDSample1.Domain.RoomTypess;
using DDDSample1.Domain.Shared;


namespace DDDSample1.Domain.SurgeryRooms
{
    public class SurgeryRoomDto
    {
        public Guid Id { get; set; }

        public int RoomNumber { get; set; }
        public RTId Type { get; set; }

        public int Capacity { get; set; }

        public List<string> AssignedEquipment { get; set; }

        public string Status { get; set; }

        public List<Slot> MaintenanceSlots { get; set; }

        public SurgeryRoomDto(Guid id, int number, RTId type, int capacity, List<string> assignedEquipment, string status, List<Slot> maintenanceSlots)
        {
            this.Id = id;
            this.RoomNumber = number;
            this.Type = type;
            this.Capacity = capacity;
            this.AssignedEquipment = assignedEquipment;
            this.Status = status;
            this.MaintenanceSlots = maintenanceSlots;
            
        }

    }
}