using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public class CreatingUserDto
    {
        public string Username { get; set; }
        public Email Email { get; set; }
        public string Role { get; set; }

        public CreatingUserDto(string username, Email email, string role)
        {
            this.Username = username;
            this.Email = email;
            this.Role = role;
        }
    }
}
