using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{

   public class EmergencyContact : IValueObject
   {
    public FullName Name { get; private set; }
    public PhoneNumber Phone { get;  private set; }

    public Email Email { get;  private set; }


    public EmergencyContact(){}

    public EmergencyContact(string name, PhoneNumber phoneNumber, Email email)
    {
      this.Name = new FullName(name);
      Console.Write("sssssssssss ${Name}");
      this.Phone = phoneNumber;
      this.Email = email;
    }

      IEnumerable<object> IValueObject.GetEqualityComponents()
      {
          yield return Name;
          yield return Phone;
          yield return Email;
      }
    }

}