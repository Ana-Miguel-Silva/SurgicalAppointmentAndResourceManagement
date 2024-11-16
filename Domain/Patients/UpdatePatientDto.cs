using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients;

public class UpdatePatientDto
{
        public Guid Id { get; set; }

        public string? name { get;  set; }

        public string? gender { get; set; }  
        public List<string>? Allergies { get; set; } 
        public List<string>? AppointmentHistory { get; set; }  
       
         public string? nameEmergency { get;   set; }
        public PhoneNumber? phoneEmergency { get;   set; }
        public Email? emailEmergency { get;   set; }


        public PhoneNumber? Phone { get;   set; }

         public Email? Email { get;   set; }

         public Email? UserEmail { get;   set; }

    public UpdatePatientDto(Guid id, string? name = null, string? gender = null, List<string>? allergies = null,
        List<string>? appointmentHistory = null, string? nameEmergency = null, PhoneNumber? phoneEmergency = null, Email? emailEmergency = null, PhoneNumber? phone = null, Email? email = null, Email? userEmail = null)
    {
        this.Id= id;
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