using BCrypt.Net;

namespace DDDSample1.Domain.Shared
{
    public class Password : IValueObject
    {
        public string Pass { get; private set; }

        private Password() { }

        public Password(string plainTextPassword)
        {
            if (string.IsNullOrWhiteSpace(plainTextPassword) || !ContainsCapital(plainTextPassword) ||
                !ContainsDigit(plainTextPassword) || !ContainsNonAlphanumeric(plainTextPassword) ||
                plainTextPassword.Length < 10)
            {
                throw new ArgumentException("Invalid password format", nameof(plainTextPassword));
            }

            // Hash the password using BCrypt
            Pass = BCrypt.Net.BCrypt.HashPassword(plainTextPassword);
            //Console.WriteLine(Pass);
        }

        public bool Verify(string plainTextPassword)
        {   
            //Console.WriteLine(BCrypt.Net.BCrypt.EnhancedVerify(plainTextPassword, Pass));
            return BCrypt.Net.BCrypt.Verify(plainTextPassword, Pass);
        }

        private bool ContainsDigit(string input) => input.Any(char.IsDigit);
        private bool ContainsCapital(string input) => input.Any(char.IsUpper);
        private bool ContainsNonAlphanumeric(string input) => input.Any(c => !char.IsLetterOrDigit(c));

        public IEnumerable<object> GetEqualityComponents()
        {
            yield return Pass;
        }
    }
}
