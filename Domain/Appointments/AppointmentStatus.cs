namespace DDDSample1.Domain.Appointments
{
    public static class AppointmentStatus
    {
        public const string SCHEDULED = "SCHEDULED";
        public const string COMPLETED = "COMPLETED";
        public const string CANCELED = "CANCELED";

        public static string[] AppointmentStatuses()
        {
            return [SCHEDULED, COMPLETED, CANCELED];
        }

        public static bool IsValid(string Status)
        {
            return AppointmentStatuses().Contains(Status);
        }
    }
}