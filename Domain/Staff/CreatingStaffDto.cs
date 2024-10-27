using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Staff
{
    public partial class CreatingStaffDto
    {
        public string Name { get; set; }
        public string Specialization { get; private set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Role { get; set; }
        public List<DateDTO> Slots { get; set; }

        public CreatingStaffDto(string name, string email, string phone, string role, string specialization, List<DateDTO> slots)
        {
            this.Name = name;
            this.Email = email;
            this.PhoneNumber = phone;
            this.Role = role;
            this.Specialization = specialization;
            this.Slots = slots;

        }
    }
}
