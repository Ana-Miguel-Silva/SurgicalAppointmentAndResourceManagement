using System;
using System.Collections.Generic;


namespace DDDSample1.Domain.Shared
{
    public class Email : IValueObject
    {


        public string FullEmail { get; private set; }

        public Email(string fullEmail)
        {
            // Optional: Validate the email format
            if (string.IsNullOrWhiteSpace(fullEmail) || !fullEmail.Contains("@"))
            {
                throw new ArgumentException("Invalid email format", nameof(fullEmail));
            }

            FullEmail = fullEmail;
        }

        public string GetUsername()
        {
            string[] list = FullEmail.Split('@');
            return list.Length > 0 ? list[0] : string.Empty;
        }

        public IEnumerable<object> GetEqualityComponents()
        {
            yield return FullEmail;
        }
    }
}