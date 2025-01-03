using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Users;


namespace DDDSample1.ApplicationService.OperationTypes
{
    public class OperationTypeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IOperationTypeRepository _repo;

        public OperationTypeService(IUnitOfWork unitOfWork, IOperationTypeRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<OperationTypeDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();

            List<OperationTypeDto> listDto = list.ConvertAll<OperationTypeDto>(operationType =>
                new(operationType.Id.AsGuid(), operationType.Name, operationType.RequiredStaff, operationType.EstimatedDuration, operationType.Active));

            return listDto;
        }

        public async Task<OperationTypeDto> GetByIdAsync(OperationTypeId id)
        {
            var operationType = await this._repo.GetByIdAsync(id);

            if (operationType == null)
                return null;

            return new OperationTypeDto(operationType.Id.AsGuid(), operationType.Name, operationType.RequiredStaff, operationType.EstimatedDuration, operationType.Active);
        }

        public async Task<OperationTypeDto> AddAsync(CreatingOperationTypeDto dto)
        {

            //CheckName(dto.Name);
            CheckEstimatedTime(dto.EstimatedDuration);
            CheckRequiredStaff(dto.RequiredStaff);

            var operationType = new OperationType(dto.Name, dto.RequiredStaff, dto.EstimatedDuration);

            await this._repo.AddAsync(operationType);

            await this._unitOfWork.CommitAsync();

            return new OperationTypeDto(operationType.Id.AsGuid(), operationType.Name, operationType.RequiredStaff, operationType.EstimatedDuration, operationType.Active);
        }

        public async Task<OperationTypeDto> UpdateAsync(Guid id, UpdateOperationTypeDto dto)
        {

            var operationType = await this._repo.GetByIdAsync(new OperationTypeId(id));

            if (operationType == null)
                return null;
            if (dto.Name != null && !string.IsNullOrWhiteSpace(dto.Name))
            operationType.ChangeName(dto.Name);

            if (dto.RequiredStaff != null && dto.RequiredStaff.Any())
            operationType.ChangeRequiredStaff(dto.RequiredStaff);

            if (dto.EstimatedDuration != null)
            operationType.ChangeEstimatedDuration(dto.EstimatedDuration);

            await this._unitOfWork.CommitAsync();

            return new OperationTypeDto(operationType.Id.AsGuid(), operationType.Name, operationType.RequiredStaff, operationType.EstimatedDuration, operationType.Active);
        }

        public async Task<OperationTypeDto> InactivateAsync(OperationTypeId id)
        {
            var operationType = await this._repo.GetByIdAsync(id);

            if (operationType == null)
                return null;

            operationType.MarkAsInative();

            await this._unitOfWork.CommitAsync();

            return new OperationTypeDto(operationType.Id.AsGuid(), operationType.Name, operationType.RequiredStaff, operationType.EstimatedDuration, operationType.Active);
        }

        public async Task<OperationTypeDto> DeleteAsync(OperationTypeId id)
        {
            var operationType = await this._repo.GetByIdAsync(id);

            if (operationType == null)
                return null;

            if (operationType.Active)
                throw new BusinessRuleValidationException("It is not possible to delete an active operation type.");

            this._repo.Remove(operationType);
            await this._unitOfWork.CommitAsync();

            return new OperationTypeDto(operationType.Id.AsGuid(), operationType.Name, operationType.RequiredStaff, operationType.EstimatedDuration, operationType.Active);
        }
        private static void CheckEstimatedTime(EstimatedDuration estimatedTime)
        {
            if (estimatedTime == null)
                throw new BusinessRuleValidationException("Invalid Estimated Time.");
        }

        private static void CheckRequiredStaff(List<RequiredStaff> requiredStaff)
        {
            if (requiredStaff == null || requiredStaff.Count == 0)
                throw new BusinessRuleValidationException("Invalid Required Staff.");

        }


    public async Task<List<OperationTypeDto>> GetAllFilteredAsync(
                string? specialization,
                bool? status
                )
            {

            var operationType = await this._repo.GetAllAsync();


          

                
            if (specialization != null)
            {
                operationType = operationType.Where(o => o.RequiredStaff.Any(rs => rs.Specialization.Equals(specialization, StringComparison.OrdinalIgnoreCase))).ToList();
            }
               
                
            if (status.HasValue)
            {
                operationType = operationType.Where(o => o.Active == status.Value).ToList();
            }

            return operationType.ConvertAll<OperationTypeDto>(operationsTypes =>
                new(operationsTypes.Id.AsGuid(), operationsTypes.Name, operationsTypes.RequiredStaff, operationsTypes.EstimatedDuration, operationsTypes.Active)).ToList();
        }

    }
}