using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationTypes
{
    public class OperationType : Entity<OperationTypeId>, IAggregateRoot
    {

        public string Name { get; private set; }

        public List<RequiredStaff> RequiredStaff { get; private set; }

        public EstimatedDuration EstimatedDuration { get; private set; }

        public bool Active { get; private set; }

        private OperationType()
        {
            this.Active = true;
        }

        public OperationType(string name, List<RequiredStaff> requiredStaff, EstimatedDuration estimatedDuration)
        {
            if (name == null || requiredStaff == null || estimatedDuration == null)
                throw new BusinessRuleValidationException("One of the operationType parameters was not valid");

            this.Id = new OperationTypeId(Guid.NewGuid());
            this.Name = name;
            this.RequiredStaff = requiredStaff;
            this.EstimatedDuration = estimatedDuration;
            this.Active = true;
        }

        public void ChangeEstimatedDuration(EstimatedDuration newEstimatedDuration)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("Cannot change the estimated duration of an inactive operationType.");

            if (newEstimatedDuration == null)
                throw new BusinessRuleValidationException("The new estimated duration must be valid.");

            this.EstimatedDuration = newEstimatedDuration;
        }

        public List<string> GetAllSpecializations(List<RequiredStaff> staffList)
        {
            HashSet<string> specializations = new HashSet<string>();

            foreach (var staff in staffList)
            {
                specializations.Add(staff.Specialization);
            }
            
            return specializations.ToList();
        }

        public void MarkAsInative()
        {
            this.Active = false;
        }
    }
}