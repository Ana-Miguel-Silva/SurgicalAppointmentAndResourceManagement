using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;

namespace DDDSample1.Domain.Appointments;

public class CreatingAppointmentDto
{
    public SurgeryRoomId RoomId { get;  set; }

    public OperationRequestId OperationRequestId { get;  set; }

    public DateDTO Date { get;  set; }
    public List<AppointmentsSlotDTO> AppointmentSlot { get; private set; }


    public CreatingAppointmentDto(string roomId, string operationRequestId, DateDTO date, List<AppointmentsSlotDTO> appointmentSlot)
    {
        this.RoomId = new SurgeryRoomId(roomId);
        this.OperationRequestId = new OperationRequestId(operationRequestId);
        this.Date = date;
        this.AppointmentSlot = appointmentSlot;
    }

}