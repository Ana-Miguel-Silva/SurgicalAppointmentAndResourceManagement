using System;
using DDDSample1.Domain.Categories;

namespace DDDSample1.Domain.Patient
{
    public class PatientDto
    {
        public Guid Id { get; set; }
        public string Description { get;  set; }

        public CategoryId CategoryId { get;  set; }

        public PatientDto()
        {
       
        }
    }
}