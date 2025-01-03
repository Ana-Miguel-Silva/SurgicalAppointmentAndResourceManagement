namespace DDDSample1.Domain.Specializations;

    public class SpecializationUIDto
    {    
        public string Id { get; set; }
        public string SpecializationName { get; set; }
        public string SpecializationDescription { get; set; }


    public SpecializationUIDto(string specializationName, string specializationDescription, string id)
        {
            this.Id = id;
            this.SpecializationName = specializationName;
            this.SpecializationDescription = specializationDescription;
        }
    }