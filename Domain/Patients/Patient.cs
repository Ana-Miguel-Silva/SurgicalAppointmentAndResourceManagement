using System;
using DDDSample1.Domain.Shared;


namespace DDDSample1.Domain.Patients
{
    public class Patient : Entity<PatientId>, IAggregateRoot
    {
        public FullName name { get; private set; }


        public DateTime DateOfBirth { get;  private set; }

        public MedicalRecordNumber medicalRecordNumber { get;  private set; }

        public string gender { get;  private set; }

        public List<string> Allergies { get;  private set; }

        public List<string>? AppointmentHistory { get;  private set; }

        //public EmergencyContact EmergencyContact { get;  private set; }

        public string nameEmergency { get;  private set; }
        public PhoneNumber phoneEmergency { get;  private set; }
        public Email emailEmergency { get;  private set; }

        public PhoneNumber Phone { get;  private set; }

         public Email Email { get;  private set; }

         public Email UserEmail { get;  private set; }

        public bool Active { get; private set; }

        public DateTime? ExpirationDate { get;  set; }




        public Patient(string name, DateTime dateOfBirth, 
                   PhoneNumber phone,Email email, Email userEmail, string nameEmergency, PhoneNumber phoneEmergency ,Email emailEmergency, string gender, List<string> Allergies, List<string> AppointmentHistory)
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
        this.nameEmergency = nameEmergency;
        this.phoneEmergency = phoneEmergency;
        this.emailEmergency = emailEmergency;
        this.Active = true;  
        this.ExpirationDate = null;
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
            this.nameEmergency = "default dd";
            this.phoneEmergency = new PhoneNumber("999999999");
            this.emailEmergency = new Email("default@gmail.com");
            this.Active = true;     
            this.ExpirationDate = null;

        
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
            
            this.name = name;
        }

        public void ChangeNameEmergency(string name)
        {            
            this.nameEmergency = name;
        }

        public void ChangePhoneEmergency(PhoneNumber phone)
        {            
            this.phoneEmergency = phone;
        }

        public void ChangePhone(PhoneNumber phone)
        {            
            this.Phone = phone;
        }

        public void ChangeEmailEmergency(Email email)
        {            
            this.emailEmergency = email;
        }

        public void ChangeEmail(Email email)
        {            
            this.Email = email;
        }

        public void ChangeGender(string gender)
        {            
            this.gender = gender;
        }

        public void ChangeAllergies(List<string> allergiesList)
        {            
            this.Allergies = allergiesList;
        }

        public void ChangeAppointmentHistory(List<string> AppointmentHistoryList)
        {            
            this.AppointmentHistory = AppointmentHistoryList;
        }

        public void Deactivate()
        {            
            this.Active = false;
            this.ExpirationDate = DateTime.Now.AddDays(30.0);
        }

        public PatientDto ConvertToDto()
        {
            return new PatientDto
            (
                this.Id.AsGuid(),
                this.name.GetFullName(),
                this.medicalRecordNumber,
                this.DateOfBirth,
                this.Phone,
                this.Email,
                this.UserEmail,
                this.nameEmergency,
                this.phoneEmergency,
                this.emailEmergency,
                this.gender,
                this.Allergies,
                this.AppointmentHistory,
                this.Active
            );
        }



    }
}