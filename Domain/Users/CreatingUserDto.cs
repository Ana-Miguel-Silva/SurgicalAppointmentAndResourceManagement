using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Users
{
    public class CreatingUserDto
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }

        public CreatingUserDto(string username, string email, string role)
        {
            this.Username = username;
            this.Email = email;
            this.Role = role;
        }
    }
}
