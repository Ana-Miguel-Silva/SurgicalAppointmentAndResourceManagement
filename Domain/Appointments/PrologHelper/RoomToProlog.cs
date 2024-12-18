namespace DDDSample1.Domain.Appointments
{
    public class RoomToProlog
    {
        public string Id { get; set; }
        public List<int> maintanceSlots { get; set; }

        public RoomToProlog(string id, List<int> maintanceSlots)
        {
            Id = id;
            this.maintanceSlots = maintanceSlots;
        }
    }

}