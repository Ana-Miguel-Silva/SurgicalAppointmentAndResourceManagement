using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.PendingActions
{
    public interface IPendingActionsRepository : IRepository<PendingActionsEntry, PendingActionsId>
    {
    }
}