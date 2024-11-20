namespace DDDSample1.Domain.SurgeryRooms
{
    public class DateDTO {
        public string Start{ get; set; }
        public string End{ get; set; }
        public DateDTO(string s, string e) {
            Start = s;
            End = e;
        }
    }
}
