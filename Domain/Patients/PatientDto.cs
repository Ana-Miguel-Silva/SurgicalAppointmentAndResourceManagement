using System;
using DDDSample1.Domain.Categories;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class PatientDto
    {
        public FullName name { get;  set; }
    
        public DateTime DateOfBirth { get;   set; }

        public MedicalRecordNumber medicalRecordNumber { get;   set; }

        public string gender { get;   set; }

        public List<string> Allergies { get;   set; }

        public List<string> AppointmentHistory { get;   set; }

        public PhoneNumber EmergencyContact { get;   set; }

        public PhoneNumber Phone { get;   set; }

         public Email Email { get;   set; }

         public Email UserEmail { get;   set; }

        public PatientDto(string name, DateTime dateOfBirth, 
                   PhoneNumber phone,Email email, Email userEmail,PhoneNumber emergencyContact, string gender, List<string> Allergies, List<string> AppointmentHistory)
        {

        //Validação para se não forem nulls
        this.medicalRecordNumber = new MedicalRecordNumber();
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