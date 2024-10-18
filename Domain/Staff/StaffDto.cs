using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staff
{
    public class StaffDto
    {
        public Guid Id { get; set; }

        public string Username { get; set; }

        public Email Email { get; set; }

        public PhoneNumber PhoneNumber { get; set; }

        public StaffDto(Guid Id, string Username, Email email, PhoneNumber phone)
        {
            this.Id = Id;
            this.Username = Username;
            this.Email = email;
            this.PhoneNumber = phone;
        }

    }
}