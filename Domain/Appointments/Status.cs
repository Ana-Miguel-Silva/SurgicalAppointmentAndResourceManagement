namespace DDDSample1.Domain.Appointments
{
    public static class Status
    {
        public const string SCHEDULED = "SCHEDULED";
        public const string COMPLETED = "COMPLETED";
        public const string CANCELED = "CANCELED";

        public static string[] Statuses()
        {
            return [SCHEDULED, COMPLETED, CANCELED];
        }

        public static bool IsValid(string Status)
        {
            return Statuses().Contains(Status);
        }
    }
}