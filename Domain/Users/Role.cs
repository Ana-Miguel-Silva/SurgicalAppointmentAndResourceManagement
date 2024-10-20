namespace DDDSample1.Domain.Users
{
    public static class Role
    {
        public const string ADMIN = "ADMIN";
        public const string DOCTOR = "DOCTOR";
        public const string NURSE = "NURSE";
        public const string TECHNICIAN = "TECHNICIAN";
        public const string PATIENT = "PATIENT";

        public static string[] Roles()
        {
            return [ADMIN, DOCTOR, NURSE, TECHNICIAN, PATIENT];
        }

        public static bool IsValid(string Status)
        {
            return Roles().Contains(Status);
        }
    }
}