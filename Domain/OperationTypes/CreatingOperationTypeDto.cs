namespace DDDSample1.Domain.OperationTypes;

public class CreatingOperationTypeDto
{
    public string Name { get; set; }
    public List<string> RequiredStaff { get; set; }
    public List<string> EstimatedDuration { get; set; }

    public CreatingOperationTypeDto(string name, List<string> requiredStaff, List<string> estimatedDuration)
    {
        this.Name = name;
        this.RequiredStaff = requiredStaff;
        this.EstimatedDuration = estimatedDuration;
    }
}