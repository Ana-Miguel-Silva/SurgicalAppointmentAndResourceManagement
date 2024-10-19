using System;
using System.Collections.Generic;


namespace DDDSample1.Domain.Shared
{
    public class Password : IValueObject
    {


        public string Pass { get; private set; }


         private Password() { }

        public Password(string password)
        {
            // Optional: Validate the email format
            if (string.IsNullOrWhiteSpace(password) || !ContainsCapital(password) || !ContainsDigit(password) || !ContainsNonAlphanumeric(password) || password.Length < 10)
            {
                throw new ArgumentException("Invalid passowrd format", nameof(password));
            }

            Pass = password;
        }

        private bool ContainsDigit(string input)
        {
            return input.Any(char.IsDigit);
        }

        private bool ContainsCapital(string input)
        {
            return input.Any(char.IsUpper);
        }

        private bool ContainsNonAlphanumeric(string input)
        {
            return input.Any(c => !char.IsLetterOrDigit(c));
        }


        public IEnumerable<object> GetEqualityComponents()
        {
            yield return Pass;
        }
    }
}