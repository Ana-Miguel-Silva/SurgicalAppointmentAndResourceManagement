using System;
using DDDSample1.Domain.Categories;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class PatientDto
    {
        public FullName name { get;  set; }

        public Guid Id { get; set; }
    
        public DateTime DateOfBirth { get;   set; }

        public MedicalRecordNumber medicalRecordNumber { get;   set; }

        public string gender { get; set; }  
        public List<string> Allergies { get; set; } 
        public List<string>? AppointmentHistory { get; set; }  
        public EmergencyContact EmergencyContact { get; set; } 

        public PhoneNumber Phone { get;   set; }

         public Email Email { get;   set; }

         public Email UserEmail { get;   set; }

        public PatientDto(Guid Id, string name, DateTime dateOfBirth, 
                   PhoneNumber phone,Email email, Email userEmail, string nameEmergency, PhoneNumber phoneEmergency ,Email emailEmergency, string gender, List<string> Allergies, List<string> AppointmentHistory)
        {

        //TODO:Validação para se não forem nulls
        this.Id = Id;
        this.medicalRecordNumber = new MedicalRecordNumber();
        this.name = new FullName(name);
        this.Allergies = Allergies;
        this.AppointmentHistory = AppointmentHistory;
        this.Phone = phone;
        this.DateOfBirth = dateOfBirth;
        this.Email = email;
        this.UserEmail = userEmail;
        this.gender = gender; 
        this.EmergencyContact = new EmergencyContact(nameEmergency, phoneEmergency, emailEmergency);     
        }

        /*public PatientDto(Guid Id,string name1, DateTime dateOfBirth, PhoneNumber phoneNumberObject, Email emailObject, Email emailUserObject, string gender)
        {
            this.Id = Id;
            this.medicalRecordNumber = new MedicalRecordNumber();
            this.name = new FullName(name1);
            this.Phone = phoneNumberObject;
            this.DateOfBirth = dateOfBirth;
            this.Email = emailObject;
            this.UserEmail = emailUserObject;
            this.gender = gender;
        }*/

        
    }
}