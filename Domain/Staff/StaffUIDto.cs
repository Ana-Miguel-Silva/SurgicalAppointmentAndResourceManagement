using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staff
{
    public class StaffUIDto
    {
        public Guid Id { get; set; }
        public string LicenseNumber { get; set; }
        public string Role { get; private set; }
        public string Specialization { get; private set; }

        public StaffUIDto(Guid Id, string licenseNumber, string role, string specialization)
        {
            this.Id = Id;
           
            this.Role = role;
            this.Specialization = specialization;
            this.LicenseNumber = licenseNumber;
        }

    }
}