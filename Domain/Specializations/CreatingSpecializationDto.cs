namespace DDDSample1.Domain.Specializations;

    public class CreatingSpecializationDto
    {    
        public string SpecializationName { get; set; }
        public string SpecializationDescription { get; set; }


    public CreatingSpecializationDto(string specializationName, string specializationDescription)
        {
            this.SpecializationName = specializationName;
            this.SpecializationDescription = specializationDescription;

        }
    }