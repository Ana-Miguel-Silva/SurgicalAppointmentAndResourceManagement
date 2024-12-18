namespace DDDSample1.Domain.Appointments
{
    public class StaffToProlog
    {
        public string LicenseNumber { get; set; }
        public string Role { get; set; }
        public string Specialization { get; set; }
        public List<int> AvailabilitySlots { get; set; }

        public StaffToProlog(string licenseNumber, string role, string specialization, List<int> availabilitySlots)
        {
            LicenseNumber = licenseNumber;
            Role = role;
            Specialization = specialization;
            AvailabilitySlots = availabilitySlots;
        }
    }

}