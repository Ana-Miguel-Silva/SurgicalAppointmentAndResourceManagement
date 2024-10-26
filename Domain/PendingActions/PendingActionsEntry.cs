using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.PendingActions
{
    public class PendingActionsEntry : Entity<PendingActionsId>, IAggregateRoot
    {
        public string Action { get; set; }


        public PendingActionsEntry(string action)
        {
            this.Id = new PendingActionsId(Guid.NewGuid());
            this.Action = action;
        }
    }
}