using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Logging
{
    public interface ILogRepository : IRepository<LogEntry, LogId>
    {
    }
}