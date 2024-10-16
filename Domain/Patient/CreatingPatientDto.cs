using DDDSample1.Domain.Categories;

namespace DDDSample1.Domain.Patient
{
    public class CreatingPatientDto
    {
        public string Description { get;  set; }

        public CategoryId CategoryId { get;   set; }


        public CreatingPatientDto(string description, CategoryId catId)
        {
            this.Description = description;
            this.CategoryId = catId;
        }
    }
}