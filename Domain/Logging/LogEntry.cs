using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Logging
{
    public class LogEntry : Entity<LogId>, IAggregateRoot
    {
        public string Entity { get; set; }
        public string Action { get; set; }
        public Guid EntityId { get; set; }
        public string Changes { get; set; }

        public LogEntry(string entity, string action, Guid entityId, string changes)
        {
            this.Id = new LogId(Guid.NewGuid());
            this.Entity = entity;
            this.Action = action;
            this.EntityId = entityId;
            this.Changes = changes;
        }
    }
}