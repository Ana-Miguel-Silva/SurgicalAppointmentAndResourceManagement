namespace DDDSample1.Domain.Shared
{
    public class RequiredStaff : IValueObject
    {
        public int Quantity { get; private set; }
        public string Specialization { get; private set; }
        public string Role { get; private set; }

        public RequiredStaff(int quantity, string specialization, string role)
        {
            if (quantity <= 0)
                throw new BusinessRuleValidationException("Quantity must be greater than zero.");
            if (string.IsNullOrWhiteSpace(specialization))
                throw new BusinessRuleValidationException("Specialization is required.");
            if (string.IsNullOrWhiteSpace(role))
                throw new BusinessRuleValidationException("Role is required.");

            Quantity = quantity;
            Specialization = specialization;
            Role = role;
        }

        public IEnumerable<object> GetEqualityComponents()
        {
            yield return Quantity;
            yield return Specialization;
            yield return Role;
        }
    }
}