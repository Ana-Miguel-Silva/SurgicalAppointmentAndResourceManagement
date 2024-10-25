using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staff
{

    public class StaffProfile : Entity<StaffGuid>, IAggregateRoot
    {
        public string StaffId { get; private set; }
        public FullName Name { get; private set; }
        public string Specialization { get; private set; }
        public Email Email { get; private set; }
        public PhoneNumber PhoneNumber { get; private set; }
        public string Role { get; private set; }

        public bool Active { get; private set; }
        
        public List<Slot> AvailabilitySlots { get; private set; }
        public string? LicenseNumber { get; private set; }


        private StaffProfile()
        {
            this.Active = true;
        }

        public StaffProfile(FullName name, Email email, PhoneNumber phone, string role, string specialization, List<Slot> slots, string ID)
        {
            this.Id = new StaffGuid(Guid.NewGuid());
            this.StaffId = ID;
            this.Name = name;
            this.Email = email;
            this.PhoneNumber = phone;
            this.Role = role;
            this.Specialization = specialization;
            this.AvailabilitySlots = slots;
             this.Active = true;
        }



        public void ChangeEmail(Email email)
        {
            Email = email;
        }

        public void ChangePhone(PhoneNumber phone)
        {
            PhoneNumber = phone;
        }

        public void UpdateSlots(List<Slot> slots)
        {
            AvailabilitySlots = slots;
        }



        public void ChangeLicenseNumber(string licenseNumber)
        {
            LicenseNumber = licenseNumber;
        }
        public void UpdateSpecialization(string specialization)
        {
            Specialization = specialization;
        }

        public void MarkAsInative()
        {
            this.Active = false;
        }
    }
}