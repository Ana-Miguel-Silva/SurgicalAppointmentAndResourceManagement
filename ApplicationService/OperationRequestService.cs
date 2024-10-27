using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Logging;
using System.Text.Json;
using DDDSample1.Domain.OperationRequests;


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

        public async Task<List<OperationRequestDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();

            List<OperationRequestDto> listDto = list.ConvertAll<OperationRequestDto>(operationRequest =>
                new(operationRequest.Id.AsGuid(), operationRequest.MedicalRecordNumber, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priority));

            return listDto;
        }

        public async Task<List<OperationRequestDto>> GetAllFilteredAsync(PatientId? patientId, OperationTypeId? operationTypeId, bool? status, string? priority, string? patientName, string? operationTypeName)
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
            return operationRequests.ConvertAll<OperationRequestDto>(operationRequest =>
                new(operationRequest.Id.AsGuid(), operationRequest.MedicalRecordNumber, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priority));
        }

        public async Task<OperationRequestDto> GetByIdAsync(OperationRequestId id)
        {
            var operationRequest = await this._repo.GetByIdAsync(id);

            if (operationRequest == null)
                return null;

            return new OperationRequestDto(operationRequest.Id.AsGuid(), operationRequest.MedicalRecordNumber, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priority);
        }

        public async Task<OperationRequestDto> AddAsync(CreatingOperationRequestDto dto, string authUserEmail)
        {
            //verifies if the auth user has a staff profile
            var doctor = await CheckDoctorAsync(authUserEmail);
            var operationType = await CheckOperationTypeAsync(dto.OperationTypeId);
            await CheckSpecializationsAsync(operationType, doctor);

            await CheckPatientAsync(dto.MedicalRecordNumber);
            CheckDate(dto.Deadline);
            CheckPriority(dto.Priority);

            var operationRequest = new OperationRequest(dto.MedicalRecordNumber, doctor.Id, dto.OperationTypeId, dto.Deadline, dto.Priority);

            await this._repo.AddAsync(operationRequest);
            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto(operationRequest.Id.AsGuid(), operationRequest.MedicalRecordNumber, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priority);
        }

        public async Task<OperationRequestDto> UpdateAsync(OperationRequestDto dto, string authUserEmail)
        {

            var doctor = await CheckDoctorAsync(authUserEmail);

            CheckDate(dto.Deadline);
            CheckPriority(dto.Priority);

            var operationRequest = await this._repo.GetByIdAsync(new OperationRequestId(dto.Id));

            if (operationRequest.DoctorId != doctor.Id)
                throw new BusinessRuleValidationException("Doctor is not the creator of the Operation Request.");

            if (operationRequest == null)
                return null;

            operationRequest.ChangeDeadline(dto.Deadline);
            operationRequest.ChangePriority(dto.Priority);

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

            if (operationRequest.Active)
                throw new BusinessRuleValidationException("It is not possible to delete an active operation request.");

            this._repo.Remove(operationRequest);
            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto(operationRequest.Id.AsGuid(), operationRequest.MedicalRecordNumber, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priority);
        }

        private async Task CheckPatientAsync(PatientId patientId)
        {
            var patient = await _repoPat.GetByIdAsync(patientId);
            if (patient == null)
                throw new BusinessRuleValidationException("Invalid Patient Id.");
        }

        private async Task<OperationType> CheckOperationTypeAsync(OperationTypeId operationTypeId)
        {
            var operationType = await _repoOpType.GetByIdAsync(operationTypeId);
            if (operationType == null)
                throw new BusinessRuleValidationException("Invalid OperationType Id.");

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
            if (!operationType.GetAllSpecializations(operationType.RequiredStaff).Contains(doctor.Specialization))
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

    }
}