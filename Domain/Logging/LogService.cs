using Microsoft.Extensions.Logging;
using DDDSample1.Domain.Shared;


namespace DDDSample1.Domain.Logging
{
    public class LogService
    {
        private readonly ILogger<LogService> _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogRepository _repo;

        public LogService(ILogger<LogService> logger, IUnitOfWork unitOfWork, ILogRepository repo)
        {
            this._logger = logger;
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task LogAsync(string entity, string action, Guid entityId, string changes)
        {
            var logEntry = new LogEntry(entity, action, entityId, changes);

            await this._repo.AddAsync(logEntry);
            await this._unitOfWork.CommitAsync();

            /*await Task.Run(() => _logger.LogInformation("Entity: {Entity}, Action: {Action}, EntityId: {EntityId}, Changes: {@Changes}",
                logEntry.Entity, logEntry.Action, logEntry.EntityId, logEntry.Changes));*/
        }
    }
}