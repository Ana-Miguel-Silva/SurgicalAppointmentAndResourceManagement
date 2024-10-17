using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{

    public class User : Entity<UserId>, IAggregateRoot
    {
        public string Username { get; private set; }
        public Email Email { get; private set; }
        public string Role { get; private set; }

        public bool Active { get; private set; }


        private User()
        {
            this.Active = true;
        }

        public User(string username, Email email, string role)
        {
            this.Id = new UserId(Guid.NewGuid());
            this.Username = username;
            this.Email = email;
            this.Role = role;

        }

        /*public User(Email email, string role)
        {
            Id = new UserId(Guid.NewGuid());
            Email = email;
            Username = email.GetUsername();
            SetRole(role);
        }

        public User(Email email)
        {
            Id = new UserId(Guid.NewGuid());
            Email = email;
            Username = email.GetUsername();
            Role = Role.Admin; 
        }*/

        public void ChangeEmail(Email email)
        {
            Email = email;
        }

        /*private void SetRole(string role)
        {
            if (!Enum.TryParse<Role>(role, out var roleParsed))
            {
                throw new ArgumentException($"Invalid role: {role}");
            }
            Role = roleParsed;
        }*/

        public void MarkAsInative()
        {
            this.Active = false;
        }
    }
}