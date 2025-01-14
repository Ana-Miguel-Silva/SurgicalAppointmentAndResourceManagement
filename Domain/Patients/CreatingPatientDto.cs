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
        public string gender { get; set; }  
        public List<string>? AppointmentHistory { get; set; }  

        public string nameEmergency { get;   set; }
        public string phoneEmergency { get;   set; }
        public string emailEmergency { get;   set; }
        public bool Active { get; private set; }

        //public EmergencyContact? EmergencyContact { get; set; } 

        /*public CreatingPatientDto(string name, DateTime dateOfBirth,string phone,string email, string userEmail, EmergencyContactDto emergencyContact, string gender, List<string> Allergies, List<string> AppointmentHistory)
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
        }*/



        public CreatingPatientDto(string name1, DateTime dateOfBirth, string phoneNumberObject, string emailObject, string emailUserObject, string gender, string phoneEmergency, string nameEmergency, string emailEmergency)
        {           
            this.Name = name1;
            this.Phone = phoneNumberObject;
            this.DateOfBirth = dateOfBirth;
            this.Email = emailObject;
            this.UserEmail = emailUserObject;
            this.gender = gender;
            this.nameEmergency = nameEmergency;
            this.phoneEmergency = (phoneEmergency);
            this.emailEmergency = (emailEmergency);
            this.Active = true;
        }

        public CreatingPatientDto(string name1, DateTime dateOfBirth, string phoneNumberObject, string emailObject, string emailUserObject, string gender)
        {           
            this.Name = name1;
            this.Phone = phoneNumberObject;
            this.DateOfBirth = dateOfBirth;
            this.Email = emailObject;
            this.UserEmail = emailUserObject;
            this.gender = gender;
            this.nameEmergency = "default";
            this.phoneEmergency = "999999999";
            this.emailEmergency = "default@gmail.com";
            this.Active = true;
        }

    }
}