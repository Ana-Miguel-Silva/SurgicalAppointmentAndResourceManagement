using DDDSample1.Domain.Categories;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class CreatingPatientDto
    {
        public string Name { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Phone { get; set; }
        public string Email { get; set; }
        public string UserEmail { get; set; }
        public EmergencyContactDto EmergencyContact { get; set; }
        public string Gender { get; set; }
        public List<string> Allergies { get; set; }
        public List<string> AppointmentHistory { get; set; }

        public CreatingPatientDto(string name, DateTime dateOfBirth,string phone,string email, string userEmail, EmergencyContactDto emergencyContact, string gender, List<string> Allergies, List<string> AppointmentHistory)
        {

        //Validação para se não forem nulls
       
        this.Name = name;
        this.Allergies = Allergies;
        this.AppointmentHistory = AppointmentHistory;
        this.Phone = phone;
        this.DateOfBirth = dateOfBirth;
        this.Email = email;
        this.UserEmail = userEmail;
        this.Gender = gender; 
        this.EmergencyContact = emergencyContact;     
        }
    }
}