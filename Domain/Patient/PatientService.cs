using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Categories;

namespace DDDSample1.Domain.Patient
{
    public class PatientService
    {/*
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPatientRepository _repo;

        private readonly ICategoryRepository _repoCat;

        public PatientService(IUnitOfWork unitOfWork, IPatientRepository repo, ICategoryRepository repoCategories)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._repoCat = repoCategories;
        }

        public async Task<List<PatientDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();
            
            List<PatientDto> listDto = list.ConvertAll<PatientDto>(prod => 
                new PatientDto(prod.Id.AsGuid(),prod.Description,prod.CategoryId));

            return listDto;
        }

        public async Task<PatientDto> GetByIdAsync(PatientId id)
        {
            var prod = await this._repo.GetByIdAsync(id);
            
            if(prod == null)
                return null;

            return new PatientDto(prod.Id.AsGuid(),prod.Description,prod.CategoryId);
        }

        public async Task<PatientDto> AddAsync(CreatingPatientDto dto)
        {
            await checkCategoryIdAsync(dto.CategoryId);
            var Patient = new Patient(dto.Description,dto.CategoryId);

            await this._repo.AddAsync(Patient);

            await this._unitOfWork.CommitAsync();

            return new PatientDto(Patient.Id.AsGuid(),Patient.Description,Patient.CategoryId);
        }

        public async Task<PatientDto> UpdateAsync(PatientDto dto)
        {
            await checkCategoryIdAsync(dto.CategoryId);
            var Patient = await this._repo.GetByIdAsync(new PatientId(dto.Id)); 

            if (Patient == null)
                return null;   

            // change all fields
            Patient.ChangeDescription(dto.Description);
            Patient.ChangeCategoryId(dto.CategoryId);
            
            await this._unitOfWork.CommitAsync();

            return new PatientDto(Patient.Id.AsGuid(),Patient.Description,Patient.CategoryId);
        }

        public async Task<PatientDto> InactivateAsync(PatientId id)
        {
            var Patient = await this._repo.GetByIdAsync(id); 

            if (Patient == null)
                return null;   

            Patient.MarkAsInative();
            
            await this._unitOfWork.CommitAsync();

            return new PatientDto(Patient.Id.AsGuid(),Patient.Description,Patient.CategoryId);
        }

        public async Task<PatientDto> DeleteAsync(PatientId id)
        {
            var Patient = await this._repo.GetByIdAsync(id); 

            if (Patient == null)
                return null;   

            if (Patient.Active)
                throw new BusinessRuleValidationException("It is not possible to delete an active Patient.");
            
            this._repo.Remove(Patient);
            await this._unitOfWork.CommitAsync();

            return new PatientDto(Patient.Id.AsGuid(),Patient.Description,Patient.CategoryId);
        }

        private async Task checkCategoryIdAsync(CategoryId categoryId)
        {
           var category = await _repoCat.GetByIdAsync(categoryId);
           if (category == null)
                throw new BusinessRuleValidationException("Invalid Category Id.");
        }*/
    }
}