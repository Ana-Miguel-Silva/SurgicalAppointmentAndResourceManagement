using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using System.Threading.Tasks.Dataflow;
using DDDSample1.Domain.Patients;

using DDDSample1.Domain.Users;
using DDDSample1.ApplicationService.Shared;
using Microsoft.AspNetCore.Http.HttpResults;
using System;



namespace DDDSample1.ApplicationService.Patients
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
                   prod.Phone, prod.Email, prod.UserEmail, prod.nameEmergency,prod.phoneEmergency , prod.emailEmergency, prod.gender, prod.Allergies, prod.AppointmentHistory, prod.Active));

            return listDto;
        }

        public async Task<PatientDto> GetByIdAsync(PatientId id)
        {
            var prod = await this._repo.GetByIdAsync(id);
            
            if(prod == null)
                return null;

            return new PatientDto( prod.Id.AsGuid(),prod.name.GetFullName(), prod.medicalRecordNumber, prod.DateOfBirth, 
                   prod.Phone, prod.Email, prod.UserEmail, prod.nameEmergency,prod.phoneEmergency , prod.emailEmergency, prod.gender, prod.Allergies, prod.AppointmentHistory, prod.Active);

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

        public async Task<PatientDto> AddAsync(CreatingPatientDto dto, string userRole)
        {

            //TODO: Mais checks ?
            CheckGender(dto.gender);

            

            var emailObject = new Email(dto.Email);
            var emailUserObject = new Email(dto.UserEmail);
            //var emergencyContactObject = new EmergencyContact(dto.EmergencyContact.Name, new PhoneNumber(dto.EmergencyContact.Phone), new Email(dto.EmergencyContact.Email));
            var phoneNumberObject = new PhoneNumber(dto.Phone);


            var Patient = new Patient(dto.Name, dto.DateOfBirth, 
                   phoneNumberObject, emailObject, emailUserObject, dto.gender);

            if(userRole.ToUpper() == Role.ADMIN ){

                //Patient.ChangeAllergies(dto.Allergies);
                Patient.ChangeAppointmentHistory(dto.AppointmentHistory);
                Patient.ChangeEmailEmergency(dto.emailEmergency);
                Patient.ChangeNameEmergency(dto.nameEmergency);
                Patient.ChangePhoneEmergency(dto.phoneEmergency);

            }

            await this._repo.AddAsync(Patient);

            

            await this._unitOfWork.CommitAsync();

             PatientDto newDto = new PatientDto( Patient.Id.AsGuid(),Patient.name.GetFullName(), Patient.medicalRecordNumber, Patient.DateOfBirth, Patient.Phone, Patient.Email, Patient.UserEmail, Patient.nameEmergency,Patient.phoneEmergency , Patient.emailEmergency, Patient.gender, Patient.Allergies, Patient.AppointmentHistory, Patient.Active);

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

        public async Task<int> VerifySensiveData(PatientDto dto, string email){
            int sendEmail = 0;

            var patient = await this._repo.GetByEmailAsync(email);


            if (patient == null)
            {
                sendEmail = -1; // Patient not found
            }

            if(!(patient.emailEmergency.FullEmail.Equals(dto.emailEmergency.FullEmail)) 
            ||!(patient.Email.FullEmail.Equals(dto.Email.FullEmail))  
            || !(patient.Phone.Number.Equals(dto.Phone.Number)) 
            || !(patient.phoneEmergency.Number.Equals(dto.phoneEmergency.Number)) 
            || !(patient.name.GetFullName().Equals(dto.name.GetFullName())) 
            || !(patient.nameEmergency.Equals(dto.nameEmergency)) ){
            

                sendEmail = 1;
            }

            return sendEmail;
            
        }

        public async Task<PatientDto> UpdateAsync(PatientDto dto, string email)
        {
            //CheckGender(dto.gender);
            //await checkCategoryIdAsync(dto.CategoryId);
           
            var patient = await this._repo.GetByEmailAsync(email);

            if (patient == null)
            {
                return null; 
            }

            if (dto.name != null && !string.IsNullOrWhiteSpace(dto.name.GetFullName()))
            {
                patient.ChangeName(new FullName(dto.name.GetFullName()));
            }

            if (dto.Email != null)
            {
                patient.ChangeEmail(dto.Email);
            }

            if (dto.Phone != null)
            {
                patient.ChangePhone(dto.Phone);
            }

            if (!string.IsNullOrWhiteSpace(dto.nameEmergency))
            {
                patient.ChangeNameEmergency(dto.nameEmergency);
            }

            if (dto.phoneEmergency != null)
            {
                patient.ChangePhoneEmergency(dto.phoneEmergency);
            }

            if (dto.emailEmergency != null)
            {
                patient.ChangeEmailEmergency(dto.emailEmergency);
            }

            if (dto.Allergies != null && dto.Allergies.Any())
            {
                patient.ChangeAllergies(dto.Allergies);
            }

            if (!string.IsNullOrWhiteSpace(dto.gender))
            {
                patient.ChangeGender(dto.gender);
            }

            if (dto.AppointmentHistory != null && dto.AppointmentHistory.Any())
            {
                patient.ChangeAppointmentHistory(dto.AppointmentHistory);
            }


            // Commit changes
            await this._unitOfWork.CommitAsync();

            return new PatientDto(
                patient.Id.AsGuid(), patient.name.toName(), patient.medicalRecordNumber,  patient.DateOfBirth, 
                patient.Phone, patient.Email, patient.UserEmail, 
                patient.nameEmergency, patient.phoneEmergency, 
                patient.emailEmergency, patient.gender, 
                patient.Allergies, patient.AppointmentHistory, patient.Active
            );
        }


        public async Task<int> VerifySensiveDataUpdate(UpdatePatientDto dto, string email){
            int sendEmail = 0;

            var patient = await this._repo.GetByEmailAsync(email);


            if (patient == null)
            {
                sendEmail = -1; // Patient not found
            }

            var comparisons = new List<(object dtoValue, object patientValue)>
            {
                (dto.emailEmergency, patient.emailEmergency?.FullEmail),
                (dto.Email, patient.Email?.FullEmail),
                (dto.Phone, patient.Phone?.Number),
                (dto.phoneEmergency, patient.phoneEmergency?.Number),
                (dto.name, patient.name?.GetFullName()),
                (dto.nameEmergency, patient.nameEmergency)
            };

            // Iterar sobre as comparações e verificar se há diferenças
            foreach (var (dtoValue, patientValue) in comparisons)
            {
                if (dtoValue != null && !dtoValue.Equals(patientValue))
                {
                    sendEmail = 1;
                    break; // Não é necessário continuar, já que encontramos uma diferença
                }
            }

            return sendEmail;
            
        }

        public async Task<UpdatePatientDto> UpdateAsyncPatch(UpdatePatientDto dto, string email)
        {
            //CheckGender(dto.gender);
            //await checkCategoryIdAsync(dto.CategoryId);
           
            var patient = await this._repo.GetByEmailAsync(email);

            if (patient == null)
            {
                return null; // Patient not found
            }


            if (dto.name != null && !string.IsNullOrWhiteSpace(dto.name))
            {
                patient.ChangeName(new FullName(dto.name));
            }

            if (dto.Email != null)
            {
                patient.ChangeEmail(new Email(dto.Email));
            }

            if (dto.Phone != null)
            {
                patient.ChangePhone(new PhoneNumber(dto.Phone));
            }

            if (!string.IsNullOrWhiteSpace(dto.nameEmergency))
            {
                patient.ChangeNameEmergency(dto.nameEmergency);
            }

            if (dto.phoneEmergency != null)
            {
                patient.ChangePhoneEmergency(new PhoneNumber(dto.phoneEmergency));
            }

            if (dto.emailEmergency != null)
            {
                patient.ChangeEmailEmergency(new Email(dto.emailEmergency));
            }

            if (dto.Allergies != null && dto.Allergies.Any())
            {
                patient.ChangeAllergies(dto.Allergies);
            }

            if (!string.IsNullOrWhiteSpace(dto.gender))
            {
                patient.ChangeGender(dto.gender);
            }

            if (dto.AppointmentHistory != null && dto.AppointmentHistory.Any())
            {
                patient.ChangeAppointmentHistory(dto.AppointmentHistory);
            }



            // Commit changes
            await this._unitOfWork.CommitAsync();

            return new UpdatePatientDto( 
             patient.name.GetFullName(), patient.gender, 
                patient.Allergies, patient.AppointmentHistory, patient.nameEmergency, patient.phoneEmergency.Number, 
                patient.emailEmergency.FullEmail,
                patient.Phone.Number, patient.Email.FullEmail, patient.UserEmail.FullEmail
                
            );
        }

        public async Task<PatientDto> InactivateAsync(PatientId id)
        {
            var prod = await this._repo.GetByIdAsync(id); 

            if (prod == null)
                return null;   

            //Patient.MarkAsInative();
            prod.Deactivate();

            await this._unitOfWork.CommitAsync();

            /*return new PatientDto(prod.Id.AsGuid(), prod.name.GetFullName(), prod.medicalRecordNumber, prod.DateOfBirth, 
                   prod.Phone, prod.Email, prod.UserEmail, prod.EmergencyContact.Name.GetFullName(),prod.EmergencyContact.Phone , prod.EmergencyContact.Email, prod.gender, prod.Allergies, prod.AppointmentHistory);*/

            return new PatientDto( prod.Id.AsGuid(),prod.name.GetFullName(), prod.medicalRecordNumber, prod.DateOfBirth, 
                   prod.Phone, prod.Email, prod.UserEmail, prod.nameEmergency,prod.phoneEmergency , prod.emailEmergency, prod.gender, prod.Allergies, prod.AppointmentHistory, prod.Active);

        }

         public async Task SendConfirmationEmail(string userEmail, string actionId)
        {

            //var token = GenerateToken(user);

           
                string urlDelete = $"{actionId}";

                var body = "You requested to delete patient account Health App account.\r\n" +
                        "<br>If you still wish to proced please copy the following code:\r\n\n" +
                        $"{urlDelete}<br>\r\n\n";

                var SendEmailRequest = new SendEmailRequest(
                    userEmail,
                    "Confirmation to delete Account",
                    body
                );

                await _mailService.SendEmailAsync(SendEmailRequest);
        }

         public async Task SendConfirmationUpdateEmail(string email, string actionId)
        {


           
                string urlDelete = $"{actionId}";

                var body = "You requested to update patient account Health App account.\r\n" +
                        "<br>If you still wish to proced please copy on the code:\r\n\n" +
                       $"{urlDelete}<br>\r\n\n";

                var SendEmailRequest = new SendEmailRequest(
                    email,
                    "Confirmation to update Account",
                    body
                );

                await _mailService.SendEmailAsync(SendEmailRequest);
        }

        public async Task<PatientDto> DeleteAsync(PatientId id)
        {
            var prod = await this._repo.GetByIdAsync(id); 

            if (prod == null)
                throw new BusinessRuleValidationException($"Patient is not registered in the database. ID not found: {id.AsString()}");

           
            //if (Patient.Active)
            //    throw new BusinessRuleValidationException("It is not possible to delete an active Patient.");
            
            this._repo.Remove(prod);
            await this._unitOfWork.CommitAsync();

            return new PatientDto( prod.Id.AsGuid(),prod.name.GetFullName(), prod.medicalRecordNumber, prod.DateOfBirth, 
                   prod.Phone, prod.Email, prod.UserEmail, prod.nameEmergency,prod.phoneEmergency , prod.emailEmergency, prod.gender, prod.Allergies, prod.AppointmentHistory, prod.Active);

        }

        public async Task<PatientDto> DeactiveAsync(PatientId id)
        {
            var prod = await this._repo.GetByIdAsync(id); 

            if (prod == null)
                throw new BusinessRuleValidationException($"Patient is not registered in the database. ID not found: {id.AsString()}");

           
            //if (Patient.Active)
            //    throw new BusinessRuleValidationException("It is not possible to delete an active Patient.");
            if (prod.Active.Equals(true))
            {

                
                prod.Deactivate();

                if(prod.ExpirationDate <= DateTime.Now)
                {
                    this._repo.Remove(prod);
                }
                       
                await this._unitOfWork.CommitAsync();

                return new PatientDto( prod.Id.AsGuid(),prod.name.GetFullName(), prod.medicalRecordNumber, prod.DateOfBirth, 
                    prod.Phone, prod.Email, prod.UserEmail, prod.nameEmergency,prod.phoneEmergency , prod.emailEmergency, prod.gender, prod.Allergies, prod.AppointmentHistory, prod.Active);

            }                    

            return null;

        }

        public async Task SendDeactivatedAccountEmail(string userEmail, string adminEmail)
        {

            //var token = GenerateToken(user);

                var body = "Your Account Health App was been deactivated and your date will be deleted in 30 days.\r\n" +
                        "<br> The admin email who deleted your data is: \r\n\n" +
                        $"{adminEmail}<br>\r\n\n" +
                        "\rIf you want to complain contact our services. \n\n\r" ;

                var SendEmailRequest = new SendEmailRequest(
                    userEmail,
                    "Deactivated account warning",
                    body
                );

                await _mailService.SendEmailAsync(SendEmailRequest);
        }




        public async Task<List<PatientDto>> GetAllFilteredAsync(
            Guid? id,
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

        if (id != null)
            patientsProfile = patientsProfile.Where(o => o.Id.AsGuid().Equals(id)).ToList();

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
                 patients.phoneEmergency, patients.emailEmergency, patients.gender, patients.Allergies, patients.AppointmentHistory, patients.Active )).ToList();
        }

        public async Task<Patient> GetPatientByEmailAsync(string? emailClaim)
        {
             var patient = await this._repo.GetByEmailAsync(emailClaim);

            if (patient == null)
            {
                return null; // Patient not found
            }

            return patient;
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