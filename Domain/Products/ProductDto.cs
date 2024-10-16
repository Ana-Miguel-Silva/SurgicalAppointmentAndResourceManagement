using System;
using DDDSample1.Domain.Categories;

namespace DDDSample1.Domain.Products
{
    public class PatientDto
    {
        public Guid Id { get; set; }
        public string Description { get;  set; }

        public CategoryId CategoryId { get;  set; }

        public PatientDto(Guid Id, string description, CategoryId catId)
        {
            this.Id = Id;
            this.Description = description;
            this.CategoryId = catId;
        }

        public PatientDto()
        {
        }
    }
}