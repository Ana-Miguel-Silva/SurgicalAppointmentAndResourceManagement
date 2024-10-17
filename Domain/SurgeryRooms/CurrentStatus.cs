namespace DDDSample1.Domain.SurgeryRooms
{
    public static class CurrentStatus
    {
        public const string AVAILABLE = "AVAILABLE";
        public const string OCCUPIED = "OCCUPIED";
        public const string UNDER_MAINTENANCE = "UNDER_MAINTENANCE";

        public static string[] CurrentStatuses()
        {
            return [AVAILABLE, OCCUPIED, UNDER_MAINTENANCE];
        }

        public static bool IsValid(string Status)
        {
            return CurrentStatuses().Contains(Status);
        }
    }
}