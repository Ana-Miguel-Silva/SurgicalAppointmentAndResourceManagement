using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;


namespace DDDSample1.Domain.Appointments
{
    public class UpdateAppointmentDto
    {
        public Guid Id { get; set; }
        public SurgeryRoomId RoomId { get; set; }
        public string Start { get; set; }
        public List<string> SelectedStaff { get; private set; }


        public UpdateAppointmentDto(string id, string roomId, string date, List<string> selectedStaff)
        {
            this.Id = new Guid(id);
            this.RoomId = new SurgeryRoomId(roomId);
            this.Start = date;
            this.SelectedStaff = selectedStaff;
        }

    }
}