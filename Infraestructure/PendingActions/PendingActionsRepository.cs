using DDDSample1.Domain.PendingActions;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.PendingActions
{
    public class PendingActionsRepository : BaseRepository<PendingActionsEntry, PendingActionsId>, IPendingActionsRepository
    {
        public PendingActionsRepository(DDDSample1DbContext context) : base(context.PendingActions)
        {
        }

    }
}