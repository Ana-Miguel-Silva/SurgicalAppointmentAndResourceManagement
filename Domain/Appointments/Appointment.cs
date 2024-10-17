using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.SurgeryRooms;

namespace DDDSample1.Domain.Appointments
{
    public class Appointment : Entity<AppointmentId>, IAggregateRoot
    {

        public SurgeryRoomId RoomId { get; private set; }

        public OperationRequestId OperationRequestId { get; private set; }

        public DateTime Date { get; private set; }

        public string AppStatus { get; private set; }

        public bool Active { get; private set; }

        private Appointment()
        {
            this.Active = true;
        }

        public Appointment(SurgeryRoomId roomId, OperationRequestId opReqId, DateTime date, string status)
        {
            if (roomId == null || opReqId == null || date == null)
                throw new BusinessRuleValidationException("One of the appointment parameters was not valid");

            this.Id = new AppointmentId(Guid.NewGuid());
            this.RoomId = roomId;
            this.OperationRequestId = opReqId;
            this.Date = date;
            this.AppStatus = status;
            this.Active = true;
        }

        public void ChangeStatus(String status)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("Cannot change the status of an inactive appointment.");

            if (status == null)
                throw new BusinessRuleValidationException("The new status must be valid.");

            this.AppStatus = status;
        }
        public void MarkAsInative()
        {
            this.Active = false;
        }
    }
}