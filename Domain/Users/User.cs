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
        public string Username { get;  set; }
        public Email email { get;  set; } 
        public Role role { get;  set; } 

    
        public User() {}
        
        public User(Email email,string username, string role)
        {
            this.Id = new UserId(Guid.NewGuid());
            this.Username = username;
            this.email = email;
            Enum.TryParse<Role>(role, out var roleParsed);
            this.role = roleParsed;
        }

        public User(Email email, string role)
        {
            this.Id = new UserId(Guid.NewGuid());
            this.email = email;
            this.Username = this.email.GetUsername();
            Enum.TryParse<Role>(role, out var roleParsed);
            this.role = roleParsed;
        }

        public User(Email email)
        {
            this.Id = new UserId(Guid.NewGuid());            
            this.email = email;
            this.Username = this.email.GetUsername();
            this.role = Role.Admin; 
        }

        public void ChangeEmail(Email email)
        {
            this.email = email;
        }
    }
}
