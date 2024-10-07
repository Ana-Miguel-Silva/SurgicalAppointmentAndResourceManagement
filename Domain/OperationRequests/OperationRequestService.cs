using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Categories;
using System;

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
                new (operationRequest.Id.AsGuid(), operationRequest.PatientId, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priorirty));

            return listDto;
        }

        public async Task<OperationRequestDto> GetByIdAsync(OperationRequestId id)
        {
            var operationRequest = await this._repo.GetByIdAsync(id);
            
            if(operationRequest == null)
                return null;

            return new OperationRequestDto(operationRequest.Id.AsGuid(), operationRequest.PatientId, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priorirty);
        }

        public async Task<OperationRequestDto> AddAsync(CreatingOperationRequestDto dto)
        {
            await checkCategoryIdAsync1(dto.PatientId);
            await checkCategoryIdAsync2(dto.DoctorId);
            await checkCategoryIdAsync3(dto.OperationTypeId);            
            var operationRequest = new OperationRequest(dto.PatientId, dto.DoctorId, dto.OperationTypeId, dto.Deadline, dto.Priorirty);

            await this._repo.AddAsync(operationRequest);

            await this._unitOfWork.CommitAsync();

            return new OperationRequestDto(operationRequest.Id.AsGuid(), operationRequest.PatientId, operationRequest.DoctorId, operationRequest.OperationTypeId, operationRequest.Deadline, operationRequest.Priorirty);
        }

        public async Task<OperationRequestDto> UpdateAsync(OperationRequestDto dto)
        {
            await checkCategoryIdAsync1(dto.PatientId);
            await checkCategoryIdAsync2(dto.DoctorId);
            await checkCategoryIdAsync3(dto.OperationTypeId);

            var operationRequest = await this._repo.GetByIdAsync(new OperationRequestId(dto.Id)); 

            if (operationRequest == null)
                return null;   

            // change all fields

            //operationRequest.ChangePatientId(dto.PatientId);
            //operationRequest.ChangeDoctorId(dto.DoctorId);
            //operationRequest.ChangeOperationTypeId(dto.OperationTypeId);

            operationRequest.ChangeDeadline(dto.Deadline);

            //operationRequest.ChangePatientId(dto.PatientId);
            //operationRequest.ChangeDoctorId(dto.DoctorId);
            //operationRequest.ChangeOperationTypeId(dto.OperationTypeId);
            
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

        private async Task checkCategoryIdAsync1(CategoryId categoryId)
        {
           var category = await _repoCat.GetByIdAsync(categoryId);
           if (category == null)
                throw new BusinessRuleValidationException("Invalid Category Id1.");
        }

        private async Task checkCategoryIdAsync2(CategoryId categoryId)
        {
           var category = await _repoCat.GetByIdAsync(categoryId);
           if (category == null)
                throw new BusinessRuleValidationException("Invalid Category Id2.");
        }

        private async Task checkCategoryIdAsync3(CategoryId categoryId)
        {
           var category = await _repoCat.GetByIdAsync(categoryId);
           if (category == null)
                throw new BusinessRuleValidationException("Invalid Category Id3.");
        }

    }
}