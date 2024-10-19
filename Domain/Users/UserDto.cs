using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public class UserDto
    {
        public Guid Id { get; set; }

        public string Username { get; set; }

        public Email Email { get; set; }

        public Password Password { get; set; }

        public string Role { get; set; }

        public UserDto(Guid Id, string Username, Email email, string role)
        {
            this.Id = Id;
            this.Username = Username;
            this.Email = email;
            this.Role = role;
        }


        public void SetUpPassword(Password password)
        {
            Password = password;
        }

    }
}