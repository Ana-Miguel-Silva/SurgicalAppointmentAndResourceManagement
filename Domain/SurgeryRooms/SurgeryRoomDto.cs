using DDDSample1.Domain.Shared;


namespace DDDSample1.Domain.SurgeryRooms
{
    public class SurgeryRoomDto
    {
        public Guid Id { get; set; }

        public string Type { get; set; }

        public int Capacity { get; set; }

        public List<string> AssignedEquipment { get; set; }

        public string Status { get; set; }

        public List<Slot> MaintenanceSlots { get; set; }

        public SurgeryRoomDto(Guid Id, string Type, int Capacity, List<string> AssignedEquipment, string Status, List<Slot> MaintenanceSlots)
        {
            this.Id = Id;
            this.Type = Type;
            this.Capacity = Capacity;
            this.AssignedEquipment = AssignedEquipment;
            this.Status = Status;
            this.MaintenanceSlots = MaintenanceSlots;
            
        }

    }
}