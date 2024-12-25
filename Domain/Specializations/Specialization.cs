using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Specializations
{
    public class Specialization : Entity<SpecializationId>, IAggregateRoot
    {

        public string SpecializationName { get; private set; }
        public string SpecializationDescription { get; private set; }


        private Specialization()
        {
        }

        public Specialization(string specializationName, string SpecializationDescription)
        {

            if (specializationName == null || SpecializationDescription == null)
                throw new BusinessRuleValidationException("One of the operation request parameters was not valid");

            this.Id = new SpecializationId(Guid.NewGuid());
            this.SpecializationName = specializationName.ToUpper();
            this.SpecializationDescription = SpecializationDescription;
        }
    }
}