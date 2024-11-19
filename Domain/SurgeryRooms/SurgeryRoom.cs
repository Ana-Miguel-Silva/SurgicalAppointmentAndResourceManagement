using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.SurgeryRooms
{
    public class SurgeryRoom : Entity<SurgeryRoomId>, IAggregateRoot
    {
        public int RoomNumber { get; private set; }
        public string Type { get; private set; }
        public int Capacity { get; private set; }
        public List<string> AssignedEquipment { get; private set; }
        public string CurrentStatus { get; private set; }
        public List<Slot> MaintenanceSlots { get; private set; }

        private SurgeryRoom()
        {
            AssignedEquipment = new List<string>();
            MaintenanceSlots = new List<Slot>();
        }

        public SurgeryRoom(int number, string type, int capacity, List<string> assignedEquipment, string status, List<Slot> maintenanceSlots)
        {
            if (type == null || capacity <= 0)
                throw new BusinessRuleValidationException("One of the surgery room parameters was not valid");

            this.Id = new SurgeryRoomId(Guid.NewGuid());
            this.RoomNumber = number;
            this.Type = type;
            this.Capacity = capacity;
            this.AssignedEquipment = assignedEquipment ?? new List<string>();
            this.CurrentStatus = status;
            this.MaintenanceSlots = maintenanceSlots ?? new List<Slot>();
        }

        public void ChangeCurrentStatus(string status)
        {
            if (string.IsNullOrWhiteSpace(status))
                throw new BusinessRuleValidationException("The new status must be valid.");
            this.CurrentStatus = status;
        }
    }
}