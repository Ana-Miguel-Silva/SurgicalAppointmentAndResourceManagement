using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Shared
{
    public class Email
    {
        public string fullEmail { get; private set; }

        public Email(string email)
        {
            if (string.IsNullOrWhiteSpace(email) || !IsValidEmail(email))
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

        private bool IsValidEmail(string email)
        {
            return new System.ComponentModel.DataAnnotations.EmailAddressAttribute().IsValid(email);
        }
    }
}
