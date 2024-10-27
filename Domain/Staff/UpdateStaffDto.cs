using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staff
{
    public class UpdateStaffDto
    {
        public string? Specialization { get; private set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }

        public UpdateStaffDto(string email, string phone, string specialization)
        {
            this.Email = email;
            this.PhoneNumber = phone;
            this.Specialization = specialization;

        }

    }
}
