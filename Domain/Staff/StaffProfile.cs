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
            if (name == null || email == null || phone == null || role == null || specialization == null || slots == null || ID == null)
                throw new BusinessRuleValidationException("One of the Staff parameters was not valid");

            this.Id = new StaffGuid(Guid.NewGuid());
            this.StaffId = ID;
            this.Name = name;
            this.Email = email;
            this.PhoneNumber = phone;
            this.Role = role.ToUpper();
            this.Specialization = specialization.ToUpper();
            this.AvailabilitySlots = slots;
            this.Active = true;
        }



        public void ChangeEmail(Email email)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("Cannot change the Email of an inactive Staff.");

            if (email == null)
                throw new BusinessRuleValidationException("The new Email must be valid.");
            Email = email;
        }

        public void ChangePhone(PhoneNumber phone)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("Cannot change the Phone Number of an inactive Staff.");

            if (phone == null)
                throw new BusinessRuleValidationException("The new Phone Number must be valid.");
            PhoneNumber = phone;
        }

        public void AddSlots(List<DateDTO> slots)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("Cannot change the Slots of an inactive Staff.");
            foreach(DateDTO slot in slots) {
                AvailabilitySlots.Add(new Slot(slot.Start, slot.End));
            }
        }

        public void RemoveSlots(List<DateDTO> slots)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("Cannot change the Slots of an inactive Staff.");
            foreach(DateDTO slot in slots) {
                AvailabilitySlots.Remove(new Slot(slot.Start, slot.End));
            }
        }



        public void ChangeLicenseNumber(string licenseNumber)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("Cannot change the License Number of an inactive Staff.");

            if (licenseNumber == null)
                throw new BusinessRuleValidationException("The new License Number must be valid.");
            LicenseNumber = licenseNumber;
        }
        public void UpdateSpecialization(string specialization)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("Cannot change the Specialization of an inactive Staff.");

            if (specialization == null)
                throw new BusinessRuleValidationException("The new Specialization must be valid.");
            Specialization = specialization.ToUpper();
        }

        public void MarkAsInative()
        {
            this.Active = false;
        }
        
    }
}