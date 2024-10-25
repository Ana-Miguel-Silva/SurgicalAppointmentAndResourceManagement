using System;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Shared
{
    public class FullName : IValueObject
    {
        public string FirstName { get; private set; }
        public string MiddleNames { get; private set; }
        public string LastName { get; private set; }

        // Parameterless constructor required by EF Core
        private FullName() { }

        // Constructor for EF Core to bind properties directly
        public FullName(string firstName, string middleNames, string lastName)
        {
            FirstName = firstName;
            MiddleNames = middleNames; // MiddleNames can be empty or null
            LastName = lastName;
        }

        // Convenience constructor for domain logic
        public FullName(string fullName)
        {

            if (string.IsNullOrWhiteSpace(fullName))
            {
                throw new ArgumentException("Name cannot be null or empty");
            }

            string[] names = fullName.Split(' ');

            this.FirstName = names[0];
            this.LastName = names[names.Length - 1];

            if (names.Length > 2)
            {
                this.MiddleNames = string.Join(" ", names.Skip(1).Take(names.Length - 2));
            }
            else
            {
                this.MiddleNames = "";
            }
        }

        public string GetFullName()
        {
            return $"{FirstName} {MiddleNames} {LastName}".Trim();
        }

        // Implement equality members for value objects
        IEnumerable<object> IValueObject.GetEqualityComponents()
        {
            yield return FirstName;
            yield return MiddleNames;
            yield return LastName;
        }

        public string toName()
        {

            if (this.MiddleNames == null || this.MiddleNames == "")
                return this.FirstName + " " + this.LastName;
            else

                return this.FirstName + " " + this.MiddleNames + " " + this.LastName;
        }
    }
}