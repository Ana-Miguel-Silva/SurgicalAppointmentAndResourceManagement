namespace DDDSample1.Domain.OperationTypes
{
    public class OperationTypeDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; }
        public List<string> RequiredStaff { get; set; }
        public List<string> EstimatedDuration { get; set; }

        public OperationTypeDto(Guid Id, string Name, List<string> RequiredStaff, List<string> EstimatedDuration)
        {
            this.Id = Id;
            this.Name = Name;
            this.RequiredStaff = RequiredStaff;
            this.EstimatedDuration = EstimatedDuration;
        }
    }
}