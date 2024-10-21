using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Categories;
using DDDSample1.Domain.Patient;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationTypes;

namespace DDDSample1.Domain.OperationRequests
{
    public class OperationRequestService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationRequestRepository _repo;

        //private readonly IPatientRepository _repoPat;
        private readonly IStaffRepository _repoDoc;
        private readonly IOperationTypeRepository _repoOpType;


        public OperationRequestService(IUnitOfWork unitOfWork, IOperationRequestRepository repo, IStaffRepository repoDoc, IOperationTypeRepository repoOpType)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            //this._repoPat = repoPat;
            this._repoDoc = repoDoc;
            this._repoOpType = repoOpType;
        }

        public async Task<List<OperationRequestDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();

            List<OperationRequestDto> listDto = list.ConvertAll<OperationRequestDto>(operationRequest =>
                new(operationRequest.Id.AsGuid(), operationRequest.PatientId, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priority));

            return listDto;
        }

        public async Task<OperationRequestDto> GetByIdAsync(OperationRequestId id)
        {
            var operationRequest = await this._repo.GetByIdAsync(id);

            if (operationRequest == null)
                return null;

            return new OperationRequestDto(operationRequest.Id.AsGuid(), operationRequest.PatientId, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priority);
        }

        public async Task<OperationRequestDto> AddAsync(CreatingOperationRequestDto dto)
        {
            //await checkPatientIdAsync(dto.PatientId);
            await checkDoctorIdAsync(dto.DoctorId);
            await checkOperationTypeIdAsync(dto.OperationTypeId);
            CheckDate(dto.Deadline);
            CheckPriority(dto.Priority);

            var operationRequest = new OperationRequest(dto.PatientId, dto.DoctorId, dto.OperationTypeId, dto.Deadline, dto.Priority);

            await this._repo.AddAsync(operationRequest);
            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto(operationRequest.Id.AsGuid(), operationRequest.PatientId, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priority);
        }

        public async Task<OperationRequestDto> UpdateAsync(OperationRequestDto dto)
        {
            CheckDate(dto.Deadline);
            CheckPriority(dto.Priority);

            var operationRequest = await this._repo.GetByIdAsync(new OperationRequestId(dto.Id));

            if (operationRequest == null)
                return null;

            // change deadline and priority
            operationRequest.ChangeDeadline(dto.Deadline);
            operationRequest.ChangePriority(dto.Priority);

            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto(operationRequest.Id.AsGuid(), operationRequest.PatientId, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priority);
        }

        public async Task<OperationRequestDto> InactivateAsync(OperationRequestId id)
        {
            var operationRequest = await this._repo.GetByIdAsync(id);

            if (operationRequest == null)
                return null;

            operationRequest.MarkAsInative();

            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto(operationRequest.Id.AsGuid(), operationRequest.PatientId, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priority);
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

            return new OperationRequestDto(operationRequest.Id.AsGuid(), operationRequest.PatientId, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priority);
        }

        /*private async Task checkPatientIdAsync(PatientId patientId)
        {
            var category = await _repoPat.GetByIdAsync(patientId);
            if (category == null)
                throw new BusinessRuleValidationException("Invalid Patient Id.");
        }*/

        private async Task checkDoctorIdAsync(StaffId doctorId)
        {
            var category = await _repoDoc.GetByIdAsync(doctorId);
            if (category == null)
                throw new BusinessRuleValidationException("Invalid Doctor Id.");
        }

        private async Task checkOperationTypeIdAsync(OperationTypeId operationTypeId)
        {
            var category = await _repoOpType.GetByIdAsync(operationTypeId);
            if (category == null)
                throw new BusinessRuleValidationException("Invalid OperationType Id.");
        }

        private static void CheckDate(DateTime date)
        {
            if (date <= DateTime.Now)
                throw new BusinessRuleValidationException("Invalid Deadline Date.");
        }

        private static void CheckPriority(String priority)
        {
            if (!Priority.IsValid(priority.ToUpper()))
                throw new BusinessRuleValidationException("Invalid Priority.");
        }

    }
}