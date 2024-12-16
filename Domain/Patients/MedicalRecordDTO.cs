using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public class MedicalRecordDTO
    {
        public string staff { get;  set; }

        public string patientEmail { get;  set; }

        public string Id { get; set; }
    
        public DateTime date { get;   set; }

        public List<string> allergies { get; set; } 
        public List<string>? medicalConditions { get; set; }  

         public string descricao { get;   set; }
       
        public MedicalRecordDTO(string Id, string staff, string email, DateTime date, 
                   string descricao, List<string> Allergies, List<string> medicalConditions)
        {

        //TODO:Validação para se não forem nulls (fazer a validação com os checks)
        this.Id = Id;
        this.staff = staff;
        this.patientEmail= email;
        this.allergies = Allergies;
        this.medicalConditions = medicalConditions;
        this.descricao = descricao;      
        }
        
    }
}