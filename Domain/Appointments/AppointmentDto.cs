using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;


namespace DDDSample1.Domain.Appointments
{
    public class AppointmentDto
    {
        public Guid Id { get; set; }

        public SurgeryRoomId RoomId { get; set; }

        public OperationRequestId OperationRequestId { get; set; }

        public Slot Date { get; set; }

        public string AppStatus { get; set; }
        public AppointmentDto(Guid id, SurgeryRoomId roomId, OperationRequestId opReqId, Slot date, string status)
        {
            this.Id = id;
            this.RoomId = roomId;
            this.OperationRequestId = opReqId;
            this.Date = date;
            this.AppStatus = status;
        }

    }
}