namespace DDDSample1.Domain.Specializations;

    public class SpecializationUIDto
    {    
        public string SpecializationName { get; set; }


    public SpecializationUIDto(string specializationName)
        {
            this.SpecializationName = specializationName;
        }
    }