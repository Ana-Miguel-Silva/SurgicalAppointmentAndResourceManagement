using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;

namespace DDDSample1.Domain.Appointments;

public class CreatingAppointmentDto
{
    public SurgeryRoomId RoomId { get; set; }
    public OperationRequestId OperationRequestId { get; set; }
    public string Start { get; set; }
    public List<string> SelectedStaff { get; private set; }


    public CreatingAppointmentDto(string roomId, string operationRequestId, string date, List<string> selectedStaff)
    {
        this.RoomId = new SurgeryRoomId(roomId);
        this.OperationRequestId = new OperationRequestId(operationRequestId);
        this.Start = date;
        this.SelectedStaff = selectedStaff;
    }

}