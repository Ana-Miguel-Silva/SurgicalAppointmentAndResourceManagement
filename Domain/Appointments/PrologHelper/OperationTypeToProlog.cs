namespace DDDSample1.Domain.Appointments
{
    public class OperationTypeToProlog
    {
        public string id { get; set; }
        public int anaesthetist_Time { get; set; }
        public int surgery_Time { get; set; }
        public int cleaning_Time { get; set; }

        public OperationTypeToProlog(string id, int anethesia, int surgery, int cleaning)
        {
            this.id = id;
            anaesthetist_Time = anethesia;
            surgery_Time = surgery;
            cleaning_Time = cleaning;
        }
    }
}