namespace DDDSample1.Domain.OperationRequests
{
    public static class Priority
    {
        public const string ELECTIVE = "ELECTIVE";
        public const string URGENT = "URGENT";
        public const string EMERGENCY = "EMERGENCY";

        public static string[] Priorities()
        {
            return [ELECTIVE, URGENT, EMERGENCY];
        }

        public static bool IsValid(string priority){

            return Priorities().Contains(priority);
        }
    }
}