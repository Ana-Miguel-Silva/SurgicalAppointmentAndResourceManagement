using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationTypes
{
    public class OperationType : Entity<OperationTypeId>, IAggregateRoot
    {

        public string Name { get; private set; }

        public List<string> RequiredStaff { get; private set; }

        public List<string> EstimatedDuration { get; private set; }

        public bool Active { get; private set; }

        private OperationType()
        {
            this.Active = true;
        }

        public OperationType(string name, List<string> requiredStaff, List<string> estimatedDuration)
        {
            if (name == null || requiredStaff == null || estimatedDuration == null)
                throw new BusinessRuleValidationException("One of the operationType parameters was not valid");

            this.Id = new OperationTypeId(Guid.NewGuid());
            this.Name = name;
            this.RequiredStaff = requiredStaff;
            this.EstimatedDuration = estimatedDuration;
            this.Active = true;
        }

        public void ChangeEstimatedDuration(List<string> newEstimatedDuration)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("Cannot change the estimated duration of an inactive operationType.");

            if (newEstimatedDuration == null)
                throw new BusinessRuleValidationException("The new estimated duration must be valid.");

            this.EstimatedDuration = newEstimatedDuration;
        }

        public void MarkAsInative()
        {
            this.Active = false;
        }
    }
}