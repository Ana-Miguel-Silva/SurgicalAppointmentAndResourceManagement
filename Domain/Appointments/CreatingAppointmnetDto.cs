using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;

namespace DDDSample1.Domain.Appointments;

public class CreatingAppointmentDto
{
    public SurgeryRoomId RoomId { get;  set; }

    public OperationRequestId OperationRequestId { get;  set; }

    public Slot Date { get;  set; }

    public string Appstatus { get;  set; }

    public CreatingAppointmentDto(SurgeryRoomId roomId, OperationRequestId opReqId, Slot date)
    {
        this.RoomId = roomId;
        this.OperationRequestId = opReqId;
        this.Date = date;
        this.Appstatus = AppointmentStatus.SCHEDULED;
    }

}