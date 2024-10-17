using System;
using System.ComponentModel.DataAnnotations;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Shared
{
    public class Email : IValueObject
    {
        [Key]
        public EmailID EmailId { get;}
        public string fullEmail { get; private set; }

        private Email() { }

        public Email(string email)
        {
            this.EmailId = new EmailID(Guid.NewGuid());
        

            if (string.IsNullOrWhiteSpace(email))
            {
                throw new ArgumentException("Invalid email format", nameof(email));
            }

            fullEmail = email;
        }

        public string GetUsername()
        {
            string[] list = fullEmail.Split('@');
            return list.Length > 0 ? list[0] : string.Empty; 
        }

        IEnumerable<object> IValueObject.GetEqualityComponents()
        {
            yield return EmailId;
            yield return fullEmail;
        }
    }
}