using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace DDDSample1.Domain.Shared
{
    public class PhoneNumber : IValueObject
    {
        string regex = @"\d{9}";
        public string Number { get; private set; }

        public PhoneNumber(string number)
        {
            // Optional: Validate the email format
            if (string.IsNullOrWhiteSpace(number) || !Regex.Match(number, regex, RegexOptions.IgnoreCase).Success)
            {
                throw new ArgumentException("Invalid phone format", nameof(number));
            }

            Number = number;
        }


        public IEnumerable<object> GetEqualityComponents()
        {
            yield return Number;
        }
    }
}