using Microsoft.Extensions.Logging;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.PendingActions
{
    public class PendingActionsService
    {
        
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPendingActionsRepository _repo;

        public PendingActionsService(IUnitOfWork unitOfWork, IPendingActionsRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<PendingActionsEntry> PendingActionsAsync(string action)
        {
            var pendingActionsEntry = new PendingActionsEntry(action);

            await this._repo.AddAsync(pendingActionsEntry);
            await this._unitOfWork.CommitAsync();

            return pendingActionsEntry;

           
        }

        public async Task<bool> TryRemove(PendingActionsId action)
        {
           var pendingActionsEntry = await this._repo.GetByIdAsync(action);

            if (pendingActionsEntry != null)
            {
               
                this._repo.Remove(pendingActionsEntry);
                await this._unitOfWork.CommitAsync();
                return true; 
            }
           
            return false;

        }

        public async Task<string> FindbyId(PendingActionsId action)
        {
           var pendingActionsEntry = await this._repo.GetByIdAsync(action);

            if (pendingActionsEntry != null)
            {
                return pendingActionsEntry.Action;
            } 

            return null;
        }
    }
}