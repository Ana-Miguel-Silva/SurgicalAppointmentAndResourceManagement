namespace DDDSample1.Domain.Specializations
{
    public class SpecializationDto
    {
        public Guid Id { get; set; }
        public string SpecializationName { get; set; }
        public string SpecializationDescription { get; set; }

        public SpecializationDto(Guid id, string specializationName, string specializationDescription)
        {
            this.Id = id;
            this.SpecializationName = specializationName;
            this.SpecializationDescription = specializationDescription;
        }
    }
}