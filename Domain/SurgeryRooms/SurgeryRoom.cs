using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.SurgeryRooms
{
    public class SurgeryRoom : Entity<SurgeryRoomId>, IAggregateRoot
    {
        public string Type { get; private set; }
        public int Capacity { get; private set; }
        public List<string> AssignedEquipment { get; private set; }
        public string Status { get; private set; }
        public List<Slot> MaintenanceSlots { get; private set; }
        public bool Active { get; private set; }

        private SurgeryRoom()
        {
            this.Active = true;
            AssignedEquipment = new List<string>();
            MaintenanceSlots = new List<Slot>();
        }

        public SurgeryRoom(string type, int capacity, List<string> assignedEquipment, string status, List<Slot> maintenanceSlots)
        {
            if (type == null || capacity <= 0)
                throw new BusinessRuleValidationException("One of the surgery room parameters was not valid");

            this.Id = new SurgeryRoomId(Guid.NewGuid());
            this.Type = type;
            this.Capacity = capacity;
            this.AssignedEquipment = assignedEquipment ?? new List<string>();
            this.Status = status;
            this.MaintenanceSlots = maintenanceSlots ?? new List<Slot>();
            this.Active = true;
        }

        public void ChangeCurrentStatus(string status)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("Cannot change the status of an inactive surgery room.");

            if (string.IsNullOrWhiteSpace(status))
                throw new BusinessRuleValidationException("The new status must be valid.");

            this.Status = status;
        }

        public void MarkAsInactive()
        {
            this.Active = false;
        }
    }
}