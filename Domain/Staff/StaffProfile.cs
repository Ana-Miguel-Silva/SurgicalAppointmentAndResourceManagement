using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staff
{

    public class StaffProfile : Entity<LicenseNumber>, IAggregateRoot
    {
        public string Username { get; private set; }
        public Email Email { get; private set; }
        public PhoneNumber PhoneNumber { get; private set; }

        public bool Active { get; private set; }


        private StaffProfile()
        {
            this.Active = true;
        }

        public StaffProfile(string username, Email email, PhoneNumber phone)
        {
            this.Id = new LicenseNumber(Guid.NewGuid());
            this.Username = username;
            this.Email = email;
            this.PhoneNumber = phone;

        }



        public void ChangeEmail(Email email)
        {
            Email = email;
        }



        public void MarkAsInative()
        {
            this.Active = false;
        }
    }
}