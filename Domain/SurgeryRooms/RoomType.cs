namespace DDDSample1.Domain.SurgeryRooms
{
    public static class RoomType
    {
        public const string OPERATING_ROOM = "OPERATING_ROOM";
        public const string CONSULTATION_ROOM = "CONSULTATION_ROOM";
        public const string ICU = "ICU";

        public static string[] RoomTypes()
        {
            return [OPERATING_ROOM, CONSULTATION_ROOM, ICU];  
        }

        public static bool IsValid(string Status)
        {
            return RoomTypes().Contains(Status);
        }
    }
}