using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Categories;

namespace DDDSample1.Domain.OperationRequests
{
    public class OperationRequestService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationRequestRepository _repo;
        private readonly ICategoryRepository _repoCat;

        public OperationRequestService(IUnitOfWork unitOfWork, IOperationRequestRepository repo, ICategoryRepository repoCategories)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
            this._repoCat = repoCategories;
        }

        public async Task<List<OperationRequestDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();

            List<OperationRequestDto> listDto = list.ConvertAll<OperationRequestDto>(operationRequest =>
                new(operationRequest.Id.AsGuid(), operationRequest.PatientId, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priorirty));

            return listDto;
        }

        public async Task<OperationRequestDto> GetByIdAsync(OperationRequestId id)
        {
            var operationRequest = await this._repo.GetByIdAsync(id);

            if (operationRequest == null)
                return null;

            return new OperationRequestDto(operationRequest.Id.AsGuid(), operationRequest.PatientId, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priorirty);
        }

        public async Task<OperationRequestDto> AddAsync(CreatingOperationRequestDto dto)
        {
            await checkPatientIdAsync(dto.PatientId);
            await checkDoctorIdAsync(dto.DoctorId);
            await checkOperationTypeIdAsync(dto.OperationTypeId);
            CheckDate(dto.Deadline);
            CheckPriority(dto.Priorirty);
            var operationRequest = new OperationRequest(dto.PatientId, dto.DoctorId, dto.OperationTypeId, dto.Deadline, dto.Priorirty);

            await this._repo.AddAsync(operationRequest);

            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto(operationRequest.Id.AsGuid(), operationRequest.PatientId, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priorirty);
        }

        public async Task<OperationRequestDto> UpdateAsync(OperationRequestDto dto)
        {
            CheckDate(dto.Deadline);
            CheckPriority(dto.Priorirty);

            var operationRequest = await this._repo.GetByIdAsync(new OperationRequestId(dto.Id));

            if (operationRequest == null)
                return null;

            // change deadline and priority
            operationRequest.ChangeDeadline(dto.Deadline);
            operationRequest.ChangePriority(dto.Priorirty);

            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto(operationRequest.Id.AsGuid(), operationRequest.PatientId, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priorirty);
        }

        public async Task<OperationRequestDto> InactivateAsync(OperationRequestId id)
        {
            var operationRequest = await this._repo.GetByIdAsync(id);

            if (operationRequest == null)
                return null;

            operationRequest.MarkAsInative();

            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto(operationRequest.Id.AsGuid(), operationRequest.PatientId, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priorirty);
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

            return new OperationRequestDto(operationRequest.Id.AsGuid(), operationRequest.PatientId, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priorirty);
        }

        private async Task checkPatientIdAsync(CategoryId patientId)
        {
            var category = await _repoCat.GetByIdAsync(patientId);
            if (category == null)
                throw new BusinessRuleValidationException("Invalid Patient Id.");
        }

        private async Task checkDoctorIdAsync(CategoryId doctorId)
        {
            var category = await _repoCat.GetByIdAsync(doctorId);
            if (category == null)
                throw new BusinessRuleValidationException("Invalid Doctor Id.");
        }

        private async Task checkOperationTypeIdAsync(CategoryId operationTypeId)
        {
            var category = await _repoCat.GetByIdAsync(operationTypeId);
            if (category == null)
                throw new BusinessRuleValidationException("Invalid OperationType Id.");
        }

        private static void CheckDate(DateTime date)
        {
            if (date <= DateTime.Now)
                throw new BusinessRuleValidationException("Invalid Deadline Date.");
        }

        private static void CheckPriority(String priorirty)
        {
            if (!Priority.IsValid(priorirty.ToUpper()))
                throw new BusinessRuleValidationException("Invalid Priorirty.");
        }

    }
}