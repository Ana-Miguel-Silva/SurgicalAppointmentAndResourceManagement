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
                new PatientDto( prod.Id.AsGuid(),prod.name.GetFullName(), prod.DateOfBirth, 
                   prod.Phone, prod.Email, prod.UserEmail,  prod.EmergencyContact.Name.GetFullName(),prod.EmergencyContact.Phone , prod.EmergencyContact.Email, prod.gender, prod.Allergies, prod.AppointmentHistory));

            return listDto;
        }

        public async Task<PatientDto> GetByIdAsync(PatientId id)
        {
            var prod = await this._repo.GetByIdAsync(id);
            
            if(prod == null)
                return null;

            return new PatientDto( prod.Id.AsGuid(),prod.name.GetFullName(), prod.DateOfBirth, 
                   prod.Phone, prod.Email, prod.UserEmail,  prod.EmergencyContact.Name.GetFullName(),prod.EmergencyContact.Phone , prod.EmergencyContact.Email, prod.gender, prod.Allergies, prod.AppointmentHistory);
        }

        /*public async Task<PatientDto> AddAsync(CreatingPatientDto dto)
        {

            CheckGender(dto.Gender);

            var emailObject = new Email(dto.Email);
            var emailUserObject = new Email(dto.UserEmail);
            var emergencyContactObject = new EmergencyContact(dto.EmergencyContact.Name, new PhoneNumber(dto.EmergencyContact.Phone), new Email(dto.EmergencyContact.Email));
            var phoneNumberObject = new PhoneNumber(dto.EmergencyContact.Phone);


            var Patient = new Patient( dto.Name, dto.DateOfBirth, 
                   phoneNumberObject, emailObject, emailUserObject, emergencyContactObject, dto.Gender, dto.Allergies, dto.AppointmentHistory);

            await this._repo.AddAsync(Patient);

            await this._unitOfWork.CommitAsync();

            return new PatientDto( Patient.Id.AsGuid(),Patient.name.GetFullName(), Patient.DateOfBirth, 
                   Patient.Phone, Patient.Email,Patient.UserEmail, Patient.EmergencyContact, Patient.gender, Patient.Allergies, Patient.AppointmentHistory);
        }*/

        public async Task<PatientDto> AddAsync(CreatingPatientDto dto)
        {

            CheckGender(dto.gender);

            var emailObject = new Email(dto.Email);
            var emailUserObject = new Email(dto.UserEmail);
            //var emergencyContactObject = new EmergencyContact(dto.EmergencyContact.Name, new PhoneNumber(dto.EmergencyContact.Phone), new Email(dto.EmergencyContact.Email));
            var phoneNumberObject = new PhoneNumber(dto.Phone);


            var Patient = new Patient(dto.Name, dto.DateOfBirth, 
                   phoneNumberObject, emailObject, emailUserObject, dto.gender);

            await this._repo.AddAsync(Patient);

            

            await this._unitOfWork.CommitAsync();

             PatientDto newDto = new PatientDto( Patient.Id.AsGuid(),Patient.name.GetFullName(), Patient.DateOfBirth, Patient.Phone, Patient.Email,Patient.UserEmail, Patient.EmergencyContact.Name.GetFullName(),Patient.EmergencyContact.Phone , Patient.EmergencyContact.Email, Patient.gender, Patient.Allergies, Patient.AppointmentHistory);

             if (string.IsNullOrEmpty(dto.Name))
            {
                throw new ArgumentException("Patient's name cannot be null or empty.");
            }
            if (dto.EmergencyContact != null && string.IsNullOrEmpty(dto.EmergencyContact.Name.GetFullName()))
            {
                throw new ArgumentException("Emergency contact's name cannot be null or empty.");
            }
            
            return newDto;
        }

        private static void CheckGender(String gender)
        {
            if (!Gender.IsValid(gender.ToUpper()))
                throw new BusinessRuleValidationException("Invalid Gender (Female/Male).");
        }

        public async Task<PatientDto> UpdateAsync(PatientDto dto)
        {
            //CheckGender(dto.gender);
            //await checkCategoryIdAsync(dto.CategoryId);
           
            if (string.IsNullOrEmpty(dto.name.GetFullName()))
            {
                throw new ArgumentException("Patient's name cannot be null or empty.");
            }
            if (dto.EmergencyContact != null && string.IsNullOrEmpty(dto.EmergencyContact.Name.GetFullName()))
            {
                throw new ArgumentException("Emergency contact's name cannot be null or empty.");
            }

             var prod = await this._repo.GetByIdAsync(new PatientId(dto.Id)); 

            
            Console.Write("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
            
            Console.Write(prod);
            Console.Write("\nAQUI");

            if (prod == null)
                return null;  


            prod.ChangeName(new FullName(dto.name.GetFullName()));
            
            await this._unitOfWork.CommitAsync();

            PatientDto n = new PatientDto( prod.Id.AsGuid(),prod.name.GetFullName(), prod.DateOfBirth, 
                   prod.Phone, prod.Email, prod.UserEmail, prod.EmergencyContact.Name.GetFullName(),prod.EmergencyContact.Phone , prod.EmergencyContact.Email, prod.gender, prod.Allergies, prod.AppointmentHistory);

                   
             if (string.IsNullOrEmpty(dto.name.GetFullName()))
            {
                throw new ArgumentException("Patient's name cannot be null or empty.");
            }
            if (dto.EmergencyContact != null && string.IsNullOrEmpty(dto.EmergencyContact.Name.GetFullName()))
            {
                throw new ArgumentException("Emergency contact's name cannot be null or empty.");
            }
            


            return n;
        }

        public async Task<PatientDto> InactivateAsync(PatientId id)
        {
            var prod = await this._repo.GetByIdAsync(id); 

            if (prod == null)
                return null;   

            //Patient.MarkAsInative();
            
            await this._unitOfWork.CommitAsync();

            return new PatientDto(prod.Id.AsGuid(), prod.name.GetFullName(), prod.DateOfBirth, 
                   prod.Phone, prod.Email, prod.UserEmail, prod.EmergencyContact.Name.GetFullName(),prod.EmergencyContact.Phone , prod.EmergencyContact.Email, prod.gender, prod.Allergies, prod.AppointmentHistory);
        }

        public async Task<PatientDto> DeleteAsync(PatientId id)
        {
            var prod = await this._repo.GetByIdAsync(id); 

            if (prod == null)
                return null;   

            //if (Patient.Active)
            //    throw new BusinessRuleValidationException("It is not possible to delete an active Patient.");
            
            this._repo.Remove(prod);
            await this._unitOfWork.CommitAsync();

            return new PatientDto(prod.Id.AsGuid(), prod.name.GetFullName(), prod.DateOfBirth, 
                   prod.Phone, prod.Email, prod.UserEmail,  prod.EmergencyContact.Name.GetFullName(),prod.EmergencyContact.Phone , prod.EmergencyContact.Email, prod.gender, prod.Allergies, prod.AppointmentHistory);
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