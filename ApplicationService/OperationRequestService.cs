using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Logging;
using System.Text.Json;
using DDDSample1.Domain.OperationRequests;
using System.CodeDom;


namespace DDDSample1.ApplicationService.OperationRequests
{
    public class OperationRequestService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationRequestRepository _repo;
        private readonly IPatientRepository _repoPat;
        private readonly IStaffRepository _repoDoc;
        private readonly IOperationTypeRepository _repoOpType;


        public OperationRequestService(IUnitOfWork unitOfWork, IOperationRequestRepository repo, IPatientRepository repoPat, IStaffRepository repoDoc, IOperationTypeRepository repoOpType)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._repoPat = repoPat;
            this._repoDoc = repoDoc;
            this._repoOpType = repoOpType;
        }

        public async Task<List<OperationRequestUIDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();

            return await Dto_to_UIDto(list);
        }

        public async Task<List<OperationRequestUIDto>> GetAllFilteredAsync(PatientId? patientId, OperationTypeId? operationTypeId, bool? status, string? priority, string? patientName, string? operationTypeName)
        {
            var operationRequests = await this._repo.GetAllAsync();

            if (patientId != null)
                operationRequests = operationRequests.Where(o => o.MedicalRecordNumber == patientId).ToList();

            if (operationTypeId != null)
                operationRequests = operationRequests.Where(o => o.OperationTypeId == operationTypeId).ToList();

            if (!string.IsNullOrEmpty(priority))
                operationRequests = operationRequests.Where(o => o.Priority.Equals(priority, StringComparison.OrdinalIgnoreCase)).ToList();

            if (!string.IsNullOrEmpty(operationTypeName))
            {
                var operationTypes = await this._repoOpType.GetByNameAsync(operationTypeName);

                var operationType = operationTypes.FirstOrDefault();

                operationRequests = operationRequests.Where(o => o.OperationTypeId == operationType.Id).ToList();
            }

            if (!string.IsNullOrEmpty(patientName))
            {

                var patients = await this._repoPat.GetByNameAsync(patientName);

                var patientIds = patients.Select(p => p.Id).ToList();

                operationRequests = operationRequests.Where(o => patientIds.Contains(o.MedicalRecordNumber)).ToList();
            }

            if (status.HasValue)
            {
                operationRequests = operationRequests.Where(o => o.Active == status.Value).ToList();
            }
            return await Dto_to_UIDto(operationRequests);
        }

        public async Task<OperationRequestDto> GetByIdAsync(OperationRequestId id)
        {
            var operationRequest = await this._repo.GetByIdAsync(id);

            if (operationRequest == null)
                return null;

            return new OperationRequestDto(operationRequest.Id.AsGuid(), operationRequest.MedicalRecordNumber, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priority);
        }

        public async Task<OperationRequestDto> AddAsync(CreatingOperationRequestUIDto dto, string authUserEmail)
        {
            //verifies if the auth user has a staff profile
            var doctor = await CheckDoctorAsync(authUserEmail);

            var operationType = await CheckOperationTypeAsync(dto.OperationTypeName);

            await CheckSpecializationsAsync(operationType, doctor);

            var patientId = await CheckPatientAsync(dto.PatientEmail);
            CheckDate(dto.Deadline);
            CheckPriority(dto.Priority);

            var operationRequest = new OperationRequest(patientId, doctor.Id, operationType.Id, dto.Deadline, dto.Priority);

            await this._repo.AddAsync(operationRequest);
            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto(operationRequest.Id.AsGuid(), operationRequest.MedicalRecordNumber, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priority);
        }

        public async Task<OperationRequestDto> UpdateAsync(UpdateOperationRequestDto dto, string authUserEmail)
        {

            var doctor = await CheckDoctorAsync(authUserEmail);


            var operationRequest = await this._repo.GetByIdAsync(new OperationRequestId(dto.Id));

            if (operationRequest.DoctorId != doctor.Id)
                throw new BusinessRuleValidationException("Doctor is not the creator of the Operation Request.");

            if (operationRequest == null)
                return null;

            if (dto.Deadline.HasValue)
            {
                CheckDate(dto.Deadline.Value);
                operationRequest.ChangeDeadline(dto.Deadline.Value);
            }

            if (!string.IsNullOrEmpty(dto.Priority))
            {
                CheckPriority(dto.Priority);
                operationRequest.ChangePriority(dto.Priority);
            }

            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto(operationRequest.Id.AsGuid(), operationRequest.MedicalRecordNumber, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priority);
        }

        public async Task<OperationRequestDto> InactivateAsync(OperationRequestId id)
        {
            var operationRequest = await this._repo.GetByIdAsync(id);

            if (operationRequest == null)
                return null;

            operationRequest.MarkAsInative();

            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto(operationRequest.Id.AsGuid(), operationRequest.MedicalRecordNumber, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priority);
        }

        public async Task<OperationRequestDto> DeleteAsync(OperationRequestId id)
        {
            var operationRequest = await this._repo.GetByIdAsync(id);

            if (operationRequest == null)
                return null;

            this._repo.Remove(operationRequest);
            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto(operationRequest.Id.AsGuid(), operationRequest.MedicalRecordNumber, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priority);
        }

        private async Task<PatientId> CheckPatientAsync(string email)
        {
            var patient = await _repoPat.GetByEmailAsync(email);
            if (patient == null)
                throw new BusinessRuleValidationException("Invalid Patient Email.");

            return patient.Id;
        }

        private async Task<OperationType> CheckOperationTypeAsync(string operationTypeName)
        {
            var operationTypes = await this._repoOpType.GetByNameAsync(operationTypeName);

            var operationType = operationTypes.FirstOrDefault();
            if (operationType == null)
                throw new BusinessRuleValidationException("Invalid OperationType.");

            return operationType;
        }

        private async Task<StaffProfile> CheckDoctorAsync(string email)
        {
            var doctors = await _repoDoc.GetByUsernameAsync(email);

            if (doctors.Count == 0 || doctors == null)
                throw new BusinessRuleValidationException("The authenticated User does not have a Staff Profileaw.");

            var doctor = doctors.FirstOrDefault();

            if (doctor == null)
                throw new BusinessRuleValidationException("The authenticated User does not have a Staff Profile12.");

            return doctor;
        }


        private async Task CheckSpecializationsAsync(OperationType operationType, StaffProfile doctor)
        {
            if (operationType.Name.ToLower() != doctor.Specialization.ToLower())
                throw new BusinessRuleValidationException("Doctor specialization does not match the OperationType specialization.");
        }

        private static void CheckDate(DateTime date)
        {
            if (date <= DateTime.Now)
                throw new BusinessRuleValidationException("Invalid Deadline Date.");
        }

        private static void CheckPriority(string priority)
        {
            if (!Priority.IsValid(priority.ToUpper()))
                throw new BusinessRuleValidationException("Invalid Priority.");
        }

        private async Task<List<OperationRequestUIDto>> Dto_to_UIDto(List<OperationRequest> list)
        {
            var listDto = new List<OperationRequestUIDto>();
            foreach (var operationRequest in list)
            {
                var operationTypes = await this._repoOpType.GetByIdAsync(operationRequest.OperationTypeId);
                var doctors = await this._repoDoc.GetByIdAsync(operationRequest.DoctorId);
                var patients = await this._repoPat.GetByIdAsync(operationRequest.MedicalRecordNumber);

                listDto.Add(new OperationRequestUIDto(operationRequest.Id.AsGuid(), patients.Email.FullEmail, doctors.Email.FullEmail, operationTypes.Name, operationRequest.Deadline, operationRequest.Priority));
            }

            return listDto;
        }


    }
}