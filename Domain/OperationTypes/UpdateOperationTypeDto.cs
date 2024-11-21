using DDDSample1.Domain.Shared;
using Newtonsoft.Json;

namespace DDDSample1.Domain.OperationTypes
{
    public class UpdateOperationTypeDto
    {
        public Guid? Id { get; set; }

        public string? Name { get; set; }
        public List<RequiredStaff>? RequiredStaff { get; set; }
        public EstimatedDuration? EstimatedDuration { get; set; }

        public bool Active { get; set; }

        public UpdateOperationTypeDto(Guid Id, string Name, List<RequiredStaff> RequiredStaff, EstimatedDuration EstimatedDuration, bool active)
        {
            this.Id = Id;
            this.Name = Name;
            this.RequiredStaff = RequiredStaff;
            this.EstimatedDuration = EstimatedDuration;
            this.Active = active;
        }
    }
}