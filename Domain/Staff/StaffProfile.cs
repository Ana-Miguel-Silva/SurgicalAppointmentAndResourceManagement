using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staff
{

    public class StaffProfile : Entity<StaffId>, IAggregateRoot
    {
        public string Username { get; private set; }
        public string Specialization { get; private set; }
        public Email Email { get; private set; }
        
        public PhoneNumber PhoneNumber { get; private set; }

        public bool Active { get; private set; }
        //public string LicenseNumber { get; private set; }


        private StaffProfile()
        {
            this.Active = true;
        }

        public StaffProfile(string username, Email email, PhoneNumber phone, string specialization)
        {
            this.Id = new StaffId(Guid.NewGuid());
            this.Username = username;
            this.Email = email;
            this.PhoneNumber = phone;
            this.Specialization = specialization;

        }



        public void ChangeEmail(Email email)
        {
            Email = email;
        }

        public void ChangePhone(PhoneNumber phone)
        {
            PhoneNumber = phone;
        }



        /*public void ChangeLicenseNumber(string licenseNumber)
        {
            LicenseNumber = licenseNumber;
        }*/


        public void MarkAsInative()
        {
            this.Active = false;
        }
    }
}