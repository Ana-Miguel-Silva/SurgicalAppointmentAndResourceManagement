namespace DDDSample1.Domain.Specializations
{
    public class SpecializationDto
    {
        public Guid Id { get; set; }
        public string SpecializationName { get; set; }

        public SpecializationDto(Guid id, string specializationName)
        {
            this.Id = id;
            this.SpecializationName = specializationName;
        }
    }
}