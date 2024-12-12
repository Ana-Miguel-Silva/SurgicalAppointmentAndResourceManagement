using DDDSample1.Domain.Staff;

namespace DDDSample1.Domain.Appointments
{
    public class RequestToProlog
    {
        public string Id { get; set; }
        public string Type { get; set; }

        public RequestToProlog(string id, string type)
        {
            Id = id;
            Type = type;
        }
    }

}