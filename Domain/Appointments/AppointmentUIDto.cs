using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;


namespace DDDSample1.Domain.Appointments
{
    public class AppointmentUIDto
    {
        public Guid Id { get; set; }

        public string RoomNumber { get; set; }

        public Slot Date { get; set; }

        public AppointmentUIDto(Guid id, string roomNumber, OperationRequestId opReqId, Slot date)
        {
            this.Id = id;
            this.RoomNumber = roomNumber;
            this.Date = date;
        }

    }
}