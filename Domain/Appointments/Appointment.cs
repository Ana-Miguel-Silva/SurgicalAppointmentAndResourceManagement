using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.SurgeryRooms;

namespace DDDSample1.Domain.Appointments
{
    public class Appointment : Entity<AppointmentId>, IAggregateRoot
    {
        public SurgeryRoomId RoomId { get; private set; }
        public OperationRequestId OperationRequestId { get; private set; }
        public Slot Date { get; private set; }
        public string AppStatus { get; private set; }
        public List<AppointmentSlot> AppointmentSlot { get; private set; }

        private Appointment() { }

        public Appointment(SurgeryRoomId roomId, OperationRequestId opReqId, Slot date, string status, List<AppointmentSlot> slots)
        {
            if (roomId == null || opReqId == null || date == null || status == null)
                throw new BusinessRuleValidationException("One of the appointment parameters was not valid");

            this.Id = new AppointmentId(Guid.NewGuid());
            this.RoomId = roomId;
            this.OperationRequestId = opReqId;
            this.Date = date;
            this.AppStatus = status;
            this.AppointmentSlot = slots;
        }

        public Appointment(string id,SurgeryRoomId roomId, OperationRequestId opReqId, Slot date, string status, List<AppointmentSlot> slots)
        {
            if (roomId == null || opReqId == null || date == null || status == null)
                throw new BusinessRuleValidationException("One of the appointment parameters was not valid");

            this.Id = new AppointmentId(Guid.Parse(id));
            this.RoomId = roomId;
            this.OperationRequestId = opReqId;
            this.Date = date;
            this.AppStatus = status;
            this.AppointmentSlot = slots;
        }

        public void ChangeStatus(string status)
        {
            this.AppStatus = status;
        }
    }
}
