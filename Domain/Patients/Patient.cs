using System;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Categories;


namespace DDDSample1.Domain.Patients
{
    public class Patient : Entity<PatientId>, IAggregateRoot
    {
        private string name1;
        private PhoneNumber phoneNumberObject;
        private Email emailObject;
        private Email emailUserObject;

        public FullName name { get; private set; }
    
        public DateTime DateOfBirth { get;  private set; }

        public MedicalRecordNumber medicalRecordNumber { get;  private set; }

        public string gender { get;  private set; }

        public List<string> Allergies { get;  private set; }

        public List<string>? AppointmentHistory { get;  private set; }

        public EmergencyContact EmergencyContact { get;  private set; }

        public PhoneNumber Phone { get;  private set; }

         public Email Email { get;  private set; }

         public Email UserEmail { get;  private set; }



        public Patient(string name, DateTime dateOfBirth, 
                   PhoneNumber phone,Email email, Email userEmail, EmergencyContact emergencyContact, string gender, List<string> Allergies, List<string> AppointmentHistory)
        {

        //Validação para se não forem nulls
        this.Id = new PatientId(Guid.NewGuid());
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

        protected Patient() { }

        public Patient(string name1, DateTime dateOfBirth, PhoneNumber phoneNumberObject, Email emailObject, Email emailUserObject, string gender)
        {
            this.Id = new PatientId(Guid.NewGuid());
            this.medicalRecordNumber = new MedicalRecordNumber();
            this.name = new FullName(name1);
            this.Phone = phoneNumberObject;
            this.DateOfBirth = dateOfBirth;
            this.Email = emailObject;
            this.UserEmail = emailUserObject;
            this.gender = gender;
            this.Allergies =  new List<string>();  
            this.AppointmentHistory = new List<string>();
            this.EmergencyContact = new EmergencyContact( string.Empty, new PhoneNumber("999999999"), new Email("default@gmail.com")); 
        }

        /*
        public void ChangeDescription(string description)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("It is not possible to change the description to an inactive Patient.");
            this.Description = description;
        }

        public void ChangeCategoryId(CategoryId catId)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("It is not possible to change the category of an inactive Patient.");
            if (catId == null)
                throw new BusinessRuleValidationException("Every Patient requires a category.");
            this.CategoryId = catId;;
        }
        public void MarkAsInative()
        {
            this.Active = false;
        }

        */

        public void ChangeName(FullName name)
        {
            //f (!this.Active)
            //    throw new BusinessRuleValidationException("It is not possible to change the description to an inactive Patient.");
            this.name = name;
        }


    }
}