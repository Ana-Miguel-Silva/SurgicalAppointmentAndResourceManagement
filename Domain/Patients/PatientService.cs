using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;



namespace DDDSample1.Domain.Patients
{
    public class PatientService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPatientRepository _repo;



        public PatientService(IUnitOfWork unitOfWork, IPatientRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<PatientDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();


            
            List<PatientDto> listDto = list.ConvertAll<PatientDto>(prod => 
                new PatientDto( prod.name.toName(), prod.DateOfBirth, 
                   prod.Phone, prod.Email, prod.UserEmail, prod.EmergencyContact, prod.gender, prod.Allergies, prod.AppointmentHistory));

            return listDto;
        }

        public async Task<PatientDto> GetByIdAsync(MedicalRecordNumber id)
        {
            var prod = await this._repo.GetByIdAsync(id);
            
            if(prod == null)
                return null;

            return new PatientDto( prod.name.toName(), prod.DateOfBirth, 
                   prod.Phone, prod.Email, prod.UserEmail, prod.EmergencyContact, prod.gender, prod.Allergies, prod.AppointmentHistory);
        }

        public async Task<PatientDto> AddAsync(CreatingPatientDto dto)
        {
            //await checkCategoryIdAsync(dto.CategoryId);
            var Patient = new Patient( dto.name.toName(), dto.DateOfBirth, 
                   dto.Phone, dto.Email, dto.UserEmail, dto.EmergencyContact, dto.gender, dto.Allergies, dto.AppointmentHistory);

            await this._repo.AddAsync(Patient);

            await this._unitOfWork.CommitAsync();

            return new PatientDto( Patient.name.toName(), Patient.DateOfBirth, 
                   Patient.Phone, Patient.Email,Patient.UserEmail, Patient.EmergencyContact, Patient.gender, Patient.Allergies, Patient.AppointmentHistory);
        }

        public async Task<PatientDto> UpdateAsync(PatientDto dto)
        {
            //await checkCategoryIdAsync(dto.CategoryId);
            var prod = await this._repo.GetByIdAsync(dto.medicalRecordNumber); 

            if (prod == null)
                return null;   

            
            await this._unitOfWork.CommitAsync();

            return new PatientDto( prod.name.toName(), prod.DateOfBirth, 
                   prod.Phone, prod.Email, prod.UserEmail, prod.EmergencyContact, prod.gender, prod.Allergies, prod.AppointmentHistory);
        }

        public async Task<PatientDto> InactivateAsync(MedicalRecordNumber id)
        {
            var prod = await this._repo.GetByIdAsync(id); 

            if (prod == null)
                return null;   

            //Patient.MarkAsInative();
            
            await this._unitOfWork.CommitAsync();

            return new PatientDto( prod.name.toName(), prod.DateOfBirth, 
                   prod.Phone, prod.Email, prod.UserEmail, prod.EmergencyContact, prod.gender, prod.Allergies, prod.AppointmentHistory);
        }

        public async Task<PatientDto> DeleteAsync(MedicalRecordNumber id)
        {
            var prod = await this._repo.GetByIdAsync(id); 

            if (prod == null)
                return null;   

            //if (Patient.Active)
            //    throw new BusinessRuleValidationException("It is not possible to delete an active Patient.");
            
            this._repo.Remove(prod);
            await this._unitOfWork.CommitAsync();

            return new PatientDto( prod.name.toName(), prod.DateOfBirth, 
                   prod.Phone, prod.Email, prod.UserEmail, prod.EmergencyContact, prod.gender, prod.Allergies, prod.AppointmentHistory);
        }
    	/*
        private async Task checkCategoryIdAsync(CategoryId categoryId)
        {
           var category = await _repoCat.GetByIdAsync(categoryId);
           if (category == null)
                throw new BusinessRuleValidationException("Invalid Category Id.");
        }*/
    }
}