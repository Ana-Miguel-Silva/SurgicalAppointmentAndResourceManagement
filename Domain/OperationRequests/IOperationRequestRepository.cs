
using DDDSample1.Domain.Categories;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationRequests
{
    public interface IOperationRequestRepository: IRepository<OperationRequest, OperationRequestId>
    {
    }
}