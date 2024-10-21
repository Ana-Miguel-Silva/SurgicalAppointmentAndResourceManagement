using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staff
{
    public class CreatingStaffDto
    {
        public string Username { get; set; }
        public string Specialization { get; private set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public CreatingStaffDto(string username, string email, string phone,  string specialization)
        {
            this.Username = username;
            this.Email = email;
            this.PhoneNumber = phone;
            this.Specialization = specialization;

        }
    }
}
