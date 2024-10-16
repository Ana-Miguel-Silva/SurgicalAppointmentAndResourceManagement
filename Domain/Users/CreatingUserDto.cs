using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public class CreatingUserDto
    {
        public string? Username { get; set; }
        public Email email { get; set; }
        public Role role { get; set; }

        
        public CreatingUserDto() { }

        public CreatingUserDto(string email, string role)
        {            
            //this.email = email;
            //this.Username = email;
            this.email = new Email(email);
            this.Username = this.email.GetUsername();
            Enum.TryParse<Role>(role, out var roleParsed);
            this.role = roleParsed;     

        }

        public CreatingUserDto(string email, string username, string role)
        {
            //this.email = email;
            //this.Username = email;
            this.email = new Email(email);
            this.Username = this.email.GetUsername();
            Enum.TryParse<Role>(role, out var roleParsed);
            this.role = roleParsed;
        }
    }
}
