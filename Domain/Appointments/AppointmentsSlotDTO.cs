namespace DDDSample1.Domain.Appointments
{
    public class AppointmentsSlotDTO {
        
        public string StaffId{ get; set; }
        public string Start{ get; set; }
        public string End{ get; set; }
        public AppointmentsSlotDTO(string s, string e, string staffId) {
            StaffId = staffId;
            Start = s;
            End = e;
        }
    }
}
