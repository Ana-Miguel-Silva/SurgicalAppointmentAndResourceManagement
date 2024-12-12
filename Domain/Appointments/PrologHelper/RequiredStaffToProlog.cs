using DDDSample1.Domain.Staff;

namespace DDDSample1.Domain.Appointments
{
    public class RequiredStaffToProlog
    {
        public string OperationTypeId { get; set; }
        public int NumberOfSpecialists { get; set; }
        public string Specialization { get; set; }
        public string Role { get; set; }

        public RequiredStaffToProlog(string id, int numberOfStaff, string specialization, string role)
        {
            OperationTypeId = id;
            this.NumberOfSpecialists = numberOfStaff;
            this.Specialization = specialization;
            this.Role = role;
        }
    }
}