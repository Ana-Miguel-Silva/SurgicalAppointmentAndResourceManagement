using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients;

public class UpdatePatientDto
{
     

        public string? name { get;  set; }

        public string? gender { get; set; }  
        public List<string>? Allergies { get; set; } 
        public List<string>? AppointmentHistory { get; set; }  
       
         public string? nameEmergency { get;   set; }
        public string? phoneEmergency { get;   set; }
        public string? emailEmergency { get;   set; }


        public string? Phone { get;   set; }

         public string? Email { get;   set; }

         public string? UserEmail { get;   set; }

    public UpdatePatientDto( string? name = null, string? gender = null, List<string>? allergies = null,
        List<string>? appointmentHistory = null, string? nameEmergency = null, string? phoneEmergency = null, string? emailEmergency = null, string? phone = null, string? email = null, string? userEmail = null)
    {
        
        this.name = name;
        this.gender = gender;
        this.Allergies = allergies;
        this.AppointmentHistory = appointmentHistory;
        this.nameEmergency = nameEmergency;
        this.phoneEmergency = phoneEmergency;
        this.emailEmergency = emailEmergency;
        this.Phone = phone;
        this.Email = email;
        this.UserEmail = userEmail;
    }

   
}