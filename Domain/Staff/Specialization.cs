namespace DDDSample1.Domain.Staff
{
    public static class Specialization
    {
        public const string PEDIATRICS = "PEDIATRICS";
        public const string SURGERY = "SURGERY";
        public const string CARDIOLOGY = "CARDIOLOGY";
        public const string ORTHOPEDICS = "ORTHOPEDICS";
        public const string ANAESTHESIOLOGY = "ANAESTHESIOLOGY";
        public const string NEUROLOGY = "NEUROLOGY";
        public const string ONCOLOGY = "ONCOLOGY";
        public const string GYNECOLOGY = "GYNECOLOGY";
        public const string OBSTETRICS = "OBSTETRICS";
        public const string RADIOLOGY = "RADIOLOGY";
        public const string UROLOGY = "UROLOGY";

        public static string[] Specializations()
        {
            return [PEDIATRICS, SURGERY, CARDIOLOGY, ORTHOPEDICS, ANAESTHESIOLOGY, NEUROLOGY, ONCOLOGY, GYNECOLOGY, OBSTETRICS, RADIOLOGY, UROLOGY];
        }

        public static bool IsValid(string Status)
        {
            return Specializations().Contains(Status);
        }
    }
}