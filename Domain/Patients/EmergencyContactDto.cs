using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{

   public class EmergencyContactDto 
   {
     public string Name { get; set; }
    public string Phone { get; set; }
    public string Email { get; set; }


    public EmergencyContactDto(){}

    public EmergencyContactDto(string name, string phoneNumber, string email)
    {
      this.Name = name;
      this.Phone = phoneNumber;
      this.Email = email;
    }

    
    }

}