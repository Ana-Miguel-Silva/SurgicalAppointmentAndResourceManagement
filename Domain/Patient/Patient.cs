using System;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Categories;
using DDDSample1.Domain.Patient;

namespace DDDSample1.Domain.Patient
{
    public class Patient : Entity<PatientId>, IAggregateRoot
    {

        public string FullName { get; private set; }
        public string FirstName { get; private set; }
        public string LastName { get; private set; }




        public DateTime DateOfBirth { get;  private set; }
        //public MedicalsConditions MedicalsConditions{ get;  private set; }
        //public EmergencyContact EmergencyContact{ get;  private set; }
        //public AppointmentHistory AppointmentHistory{ get;  private set; }



        /*public Patient(PatientId id, string firstName, string lastName, DateTime dateOfBirth, 
                   MedicalsConditions medicalsConditions, EmergencyContact emergencyContact, 
                   AppointmentHistory appointmentHistory)
    {

        //Validação para se não forem nulls

        Id = id;
        FirstName = firstName ;
        LastName = lastName ;
        DateOfBirth = dateOfBirth; 
        MedicalsConditions = medicalsConditions; 
        EmergencyContact = emergencyContact ;
        AppointmentHistory = appointmentHistory ;
        
        }*/

        public Patient()
        {
        }

        /*public void ChangeDescription(string description)
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
        }*/
    }
}