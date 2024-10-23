using DDDSample1.Domain.Categories;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class CreatingPatientDto
    {
        public FullName name { get; private set; }
    
        public DateTime DateOfBirth { get;  private set; }

        public MedicalRecordNumber medicalRecordNumber { get;  private set; }

        public string gender { get;  private set; }

        public List<string> Allergies { get;  private set; }

        public List<string> AppointmentHistory { get;  private set; }

        public PhoneNumber EmergencyContact { get;  private set; }

        public PhoneNumber Phone { get;  private set; }

         public Email Email { get;  private set; }

         public Email UserEmail { get;  private set; }

        public CreatingPatientDto(MedicalRecordNumber medicalRecordNumber, string name, DateTime dateOfBirth,PhoneNumber phone,Email email, Email userEmail, PhoneNumber emergencyContact, string gender, List<string> Allergies, List<string> AppointmentHistory)
        {

        //Validação para se não forem nulls
        this.medicalRecordNumber = medicalRecordNumber;
        this.name = new FullName(name);
        this.Allergies = Allergies;
        this.AppointmentHistory = AppointmentHistory;
        this.Phone = phone;
        this.DateOfBirth = dateOfBirth;
        this.Email = email;
        this.UserEmail = userEmail;
        this.gender = gender; 
        this.EmergencyContact = emergencyContact;     
        }
    }
}