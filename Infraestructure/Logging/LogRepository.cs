using DDDSample1.Domain.Logging;
using DDDSample1.Infrastructure.Shared;

namespace DDDSample1.Infrastructure.Logging
{
    public class LogRepository : BaseRepository<LogEntry, LogId>, ILogRepository
    {
        public LogRepository(DDDSample1DbContext context) : base(context.Logs)
        {
        }

    }
}