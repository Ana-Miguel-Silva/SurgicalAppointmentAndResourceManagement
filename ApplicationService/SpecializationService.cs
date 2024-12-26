using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;


namespace DDDSample1.ApplicationService.Specializations
{
    public class SpecializationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ISpecializationRepository _repo;


        public SpecializationService(IUnitOfWork unitOfWork, ISpecializationRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<SpecializationUIDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();

            return await Dto_to_UIDto(list);
        }

        public async Task<List<SpecializationUIDto>> GetAllFilteredAsync(string? name)
        {
            var specializations = await this._repo.GetAllAsync();

            if (!string.IsNullOrEmpty(name))
            {
                specializations = specializations.Where(o => o.SpecializationName == name).ToList();
            }
            return await Dto_to_UIDto(specializations);
        }
        public async Task<SpecializationUIDto> GetByNameAsync(string? name)
        {
            var specializations = await this._repo.GetAllAsync();
            Specialization ret = null;

            if (!string.IsNullOrEmpty(name))
            {
                ret = specializations.Where(o => o.SpecializationName == name).ToList().FirstOrDefault();
            }
            return await Dto_to_UIDtoSingle(ret);
        }

        public async Task<SpecializationDto> GetByIdAsync(SpecializationId id)
        {
            var specialization = await this._repo.GetByIdAsync(id);

            if (specialization == null)
                return null;

            return new SpecializationDto(specialization.Id.AsGuid(), specialization.SpecializationName, specialization.SpecializationDescription);
        }

        public async Task<SpecializationDto> AddAsync(CreatingSpecializationDto dto)
        {

            var specialization = new Domain.Specializations.Specialization(dto.SpecializationName, dto.SpecializationDescription);

            await this._repo.AddAsync(specialization);
            await this._unitOfWork.CommitAsync();

            return new SpecializationDto(specialization.Id.AsGuid(), specialization.SpecializationName, specialization.SpecializationDescription);
        }

        public async Task<SpecializationDto> UpdateAsync(SpecializationDto dto, string authUserEmail)
        {

            var specialization = await this._repo.GetByIdAsync(new SpecializationId(dto.Id));

            specialization.updateName(dto.SpecializationName);
            specialization.updateDescription(dto.SpecializationDescription);

            await this._unitOfWork.CommitAsync();

            return new SpecializationDto(specialization.Id.AsGuid(), specialization.SpecializationName, specialization.SpecializationDescription);
        }


        /*  public async Task<SpecializationDto> DeleteAsync(SpecializationId id)
        {
            var specialization = await this._repo.GetByIdAsync(id);

            if (specialization == null)
                return null;

            this._repo.Remove(specialization);
            await this._unitOfWork.CommitAsync();

            return new SpecializationDto(specialization.Id.AsGuid(), specialization.SpecializationName);
        }*/

        private async Task<List<SpecializationUIDto>> Dto_to_UIDto(List<Domain.Specializations.Specialization> list)
        {
            var listDto = new List<SpecializationUIDto>();
            foreach (var specialization in list)
            {
                listDto.Add(new SpecializationUIDto(specialization.SpecializationName, specialization.SpecializationDescription, specialization.Id.AsString()));
            }
            return listDto;
        }
        private async Task<SpecializationUIDto> Dto_to_UIDtoSingle(Domain.Specializations.Specialization specialization)
        {
            return new SpecializationUIDto(specialization.SpecializationName, specialization.SpecializationDescription, specialization.Id.AsString());
        }


    }
}