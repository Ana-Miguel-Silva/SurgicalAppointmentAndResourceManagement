using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationTypes;

public class CreatingOperationTypeDto
{
    public string Name { get; set; }
    public List<RequiredStaff> RequiredStaff { get; set; }
    public EstimatedDuration EstimatedDuration { get; set; }

    public CreatingOperationTypeDto(string name, List<RequiredStaff> requiredStaff, EstimatedDuration estimatedDuration)
    {
        this.Name = name;
        this.RequiredStaff = requiredStaff;
        this.EstimatedDuration = estimatedDuration;
    }
}