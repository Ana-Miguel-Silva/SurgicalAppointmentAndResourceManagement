using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.SurgeryRooms;

namespace DDDSample1.Domain.Appointments;

public class CreatingAppointmentDto
{
    public SurgeryRoomId RoomId { get; private set; }

    public OperationRequestId OperationRequestId { get; private set; }

    public DateTime Date { get; private set; }

    public string Appstatus { get; private set; }

    public CreatingAppointmentDto(SurgeryRoomId roomId, OperationRequestId opReqId, DateTime date)
    {
        this.RoomId = roomId;
        this.OperationRequestId = opReqId;
        this.Date = date;
        this.Appstatus = Status.SCHEDULED;
    }

}