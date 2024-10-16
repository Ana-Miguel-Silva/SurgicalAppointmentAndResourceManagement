using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public enum Role
    {
        Admin,
        Doctor, 
        Nurse,
        Technician,
        Patient
    }

    public class User : Entity<UserId>, IAggregateRoot
    {
        public string Username { get; private set; }
        public Email email { get; private set; } 
        public Role role { get; private set; } 

        public User() { }

        public User(string username, string email, string role)
        {
            this.Id = new UserId(Guid.NewGuid());
            this.Username = username;
            this.email = new Email(email);
            Enum.TryParse<Role>(role, out var roleParsed);
            this.role = roleParsed;
        }

        public User(string email, string role)
        {
            this.Id = new UserId(Guid.NewGuid());
            this.email = new Email(email);
            this.Username = this.email.GetUsername();
            Enum.TryParse<Role>(role, out var roleParsed);
            this.role = roleParsed;
        }

        public User(string email)
        {
            this.Id = new UserId(Guid.NewGuid());            
            this.email = new Email(email);
            this.Username = this.email.GetUsername();
            this.role = Role.Admin; 
        }

        public void ChangeEmail(string email)
        {
            this.email = new Email(email);
        }
    }
}
