using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staff
{
    public class StaffDto
    {
        public Guid Id { get; set; }
        public string LicenseNumber { get; set; }
        public string StaffId { get; set; }

        public FullName Name { get; set; }
        public string Role { get; private set; }
        public string Specialization { get; private set; }

        public Email Email { get; set; }

        public PhoneNumber PhoneNumber { get; set; }

        public List<Slot> Slots { get; set; }
        public bool Active { get; private set; }

        public StaffDto(Guid Id, FullName name, Email email, PhoneNumber phone, string role, string specialization, List<Slot> slots, string staffid, string? licenseNumber, bool active)
        {
            this.Id = Id;
            this.StaffId = staffid;
            this.Name = name;
            this.Email = email;
            this.PhoneNumber = phone;
            this.Role = role;
            this.Specialization = specialization;
            this.Slots = slots;
            this.LicenseNumber = licenseNumber;
            this.Active = active;
        }

    }
}