using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using System.Threading.Tasks.Dataflow;



namespace DDDSample1.Domain.Patients
{
    public class PatientService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPatientRepository _repo;

        private readonly IMailService _mailService;



        public PatientService(IUnitOfWork unitOfWork, IMailService mailService, IPatientRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            _mailService = mailService;
        }

        public async Task<List<PatientDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();


            
            List<PatientDto> listDto = list.ConvertAll<PatientDto>(prod => 
                new PatientDto( prod.Id.AsGuid(),prod.name.GetFullName(), prod.medicalRecordNumber, prod.DateOfBirth, 
                   prod.Phone, prod.Email, prod.UserEmail, prod.nameEmergency,prod.phoneEmergency , prod.emailEmergency, prod.gender, prod.Allergies, prod.AppointmentHistory));

            return listDto;
        }

        public async Task<PatientDto> GetByIdAsync(PatientId id)
        {
            var prod = await this._repo.GetByIdAsync(id);
            
            if(prod == null)
                return null;

            return new PatientDto( prod.Id.AsGuid(),prod.name.GetFullName(), prod.medicalRecordNumber, prod.DateOfBirth, 
                   prod.Phone, prod.Email, prod.UserEmail, prod.nameEmergency,prod.phoneEmergency , prod.emailEmergency, prod.gender, prod.Allergies, prod.AppointmentHistory);

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

             PatientDto newDto = new PatientDto( Patient.Id.AsGuid(),Patient.name.GetFullName(), Patient.medicalRecordNumber, Patient.DateOfBirth, Patient.Phone, Patient.Email, Patient.UserEmail, Patient.nameEmergency,Patient.phoneEmergency , Patient.emailEmergency, Patient.gender, Patient.Allergies, Patient.AppointmentHistory);

             if (string.IsNullOrEmpty(dto.Name))
            {
                throw new ArgumentException("Patient's name cannot be null or empty.");
            }
            if ( string.IsNullOrEmpty(dto.nameEmergency))
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
           
            var patient = await this._repo.GetByEmailAsync(dto.Email.FullEmail);

            if (patient == null)
            {
                return null; // Patient not found
            }


            //TODO: Se for dados sensiveis mandar email, logo fazer uma verificação para se algum deles for mudado ser mandado email
            // Update patient's name
            patient.ChangeName(new FullName(dto.name.GetFullName()));

            // Update emergency contact
            patient.ChangeNameEmergency(dto.nameEmergency);
            patient.ChangePhoneEmergency(dto.phoneEmergency);
            patient.ChangeEmailEmergency(dto.emailEmergency);
            patient.ChangeAllergies(dto.Allergies);
            patient.ChangeGender(dto.gender);
            patient.ChangeAppointmentHistory(dto.AppointmentHistory);

            // Commit changes
            await this._unitOfWork.CommitAsync();

            return new PatientDto(
                patient.Id.AsGuid(), patient.name.toName(), patient.medicalRecordNumber,  patient.DateOfBirth, 
                patient.Phone, patient.Email, patient.UserEmail, 
                patient.nameEmergency, patient.phoneEmergency, 
                patient.emailEmergency, patient.gender, 
                patient.Allergies, patient.AppointmentHistory
            );
        }

        public async Task<PatientDto> InactivateAsync(PatientId id)
        {
            var prod = await this._repo.GetByIdAsync(id); 

            if (prod == null)
                return null;   

            //Patient.MarkAsInative();
            
            await this._unitOfWork.CommitAsync();

            /*return new PatientDto(prod.Id.AsGuid(), prod.name.GetFullName(), prod.medicalRecordNumber, prod.DateOfBirth, 
                   prod.Phone, prod.Email, prod.UserEmail, prod.EmergencyContact.Name.GetFullName(),prod.EmergencyContact.Phone , prod.EmergencyContact.Email, prod.gender, prod.Allergies, prod.AppointmentHistory);*/

            return new PatientDto( prod.Id.AsGuid(),prod.name.GetFullName(), prod.medicalRecordNumber, prod.DateOfBirth, 
                   prod.Phone, prod.Email, prod.UserEmail, prod.nameEmergency,prod.phoneEmergency , prod.emailEmergency, prod.gender, prod.Allergies, prod.AppointmentHistory);

        }

         private async Task SendConfirmationEmail(Patient patient)
        {

            //var token = GenerateToken(user);

            var resetLink = $"https://team-name-ehehe.postman.co/workspace/f46d55f6-7e50-4557-8434-3949bdb5ccb9/request/38833556-3e300fdc-d431-41d5-8570-ce1c58b858a2?tab=body";

            string urlDelete = $"https://localhost:5001/api/Patients/{patient.Id.AsString()}/hard";

            var body = $"Hello {patient.name.GetFullName()},<br>\n" +
                    "You requested to delete your account Health App account.\r\n" +
                    "<br>If you still wish to proced please click on the following link:\r\n\n" +
                    $"{resetLink}<br>\r\n\n" +
                    "<br>In the Delete header past this info" + $"{urlDelete}<br>\r\n\n" +                     
                    "<br>If you did not request this, please ignore this email.\r\n";

            var sendEmailRequest = new SendEmailRequest(
                patient.Email.FullEmail, // Destinatário
                "Health App - Confirmation to delete account", // Assunto
                body // Corpo
            );

            await _mailService.SendEmailAsync(sendEmailRequest);
        }

        public async Task<PatientDto> DeleteAsync(PatientId id, bool isPatient)
        {
            var prod = await this._repo.GetByIdAsync(id); 

            if (prod == null)
                throw new BusinessRuleValidationException($"Patient is not registered in the database. ID not found: {id.AsString()}");

            if(isPatient){
                await SendConfirmationEmail(prod);
            }else{

            }


            //if (Patient.Active)
            //    throw new BusinessRuleValidationException("It is not possible to delete an active Patient.");
            
            this._repo.Remove(prod);
            await this._unitOfWork.CommitAsync();

            return new PatientDto( prod.Id.AsGuid(),prod.name.GetFullName(), prod.medicalRecordNumber, prod.DateOfBirth, 
                   prod.Phone, prod.Email, prod.UserEmail, prod.nameEmergency,prod.phoneEmergency , prod.emailEmergency, prod.gender, prod.Allergies, prod.AppointmentHistory);

        }

        public async Task<List<PatientDto>> GetAllFilteredAsync(
            string? nameFull,
            string? email,
            DateTime? DateOfBirth,
            List<string>? Allergies,
            string medicalRecordNumber,
            List<string>? AppointmentHistory
            )
        {

            var patientsProfile = await this._repo.GetAllAsync();

        // Filtros aplicados conforme cada critério
        if (!string.IsNullOrEmpty(nameFull))
            patientsProfile = patientsProfile.Where(o => o.name.toName().Equals(nameFull)).ToList();


        if (DateOfBirth.HasValue)
            patientsProfile = patientsProfile.Where(o => o.DateOfBirth.Date == DateOfBirth.Value.Date).ToList();

        if (Allergies != null && Allergies.Any())
            patientsProfile = patientsProfile.Where(o => o.Allergies != null && o.Allergies.Any(a => Allergies.Contains(a))).ToList();

        if (!string.IsNullOrEmpty(medicalRecordNumber))
            patientsProfile = patientsProfile.Where(o => o.medicalRecordNumber.number.Equals(medicalRecordNumber)).ToList();
        
        if (!string.IsNullOrEmpty(email))
            patientsProfile = patientsProfile.Where(o => o.Email.FullEmail.Equals(email)).ToList();

        if (AppointmentHistory != null && AppointmentHistory.Any())
            patientsProfile = patientsProfile.Where(o => o.AppointmentHistory != null && o.AppointmentHistory.Any(a => AppointmentHistory.Contains(a))).ToList();


            return patientsProfile.ConvertAll<PatientDto>(patients =>
                new(patients.Id.AsGuid(), patients.name.toName(), patients.medicalRecordNumber, patients.DateOfBirth,patients.Phone,
                 patients.Email, patients.UserEmail, patients.nameEmergency,
                 patients.phoneEmergency, patients.emailEmergency, patients.gender, patients.Allergies, patients.AppointmentHistory )).ToList();
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