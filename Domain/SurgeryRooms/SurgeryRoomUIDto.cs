namespace DDDSample1.Domain.SurgeryRooms
{
    public class SurgeryRoomUIDto
    {
        public Guid Id { get; set; }

        public int RoomNumber { get; set; }
        public string Type { get; set; }

        public SurgeryRoomUIDto(Guid id, int number, string type)
        {
            this.Id = id;
            this.RoomNumber = number;
            this.Type = type;
            
        }

    }
}