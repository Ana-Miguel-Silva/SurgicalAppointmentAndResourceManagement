using DDDSample1.Domain.Shared;
using Microsoft.Extensions.Options;
using DDDSample1.Domain.RoomTypess;
using Microsoft.EntityFrameworkCore.ChangeTracking.Internal;


namespace DDDSample1.ApplicationService.RoomTypess
{
    public class RoomTypesService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IRoomTypesRepository _repo;


        public RoomTypesService(IUnitOfWork unitOfWork, IRoomTypesRepository RoomTypesRepository)
        {
            _unitOfWork = unitOfWork;
            _repo = RoomTypesRepository;
        }
        public async Task<List<RoomTypesDto>> GetAllAsync()
        {


            var list = await this._repo.GetAllAsync();


            List<RoomTypesDto> listDto = list.ConvertAll<RoomTypesDto>(RoomTypes =>
                new (RoomTypes.ObtainId().AsString(),RoomTypes.ObtainCode().ToString(), RoomTypes.ObtainDesignacao(), RoomTypes.ObtainDescricao(), RoomTypes.ObtainSurgerySuitability()));




            return listDto;
        }

        public async Task<RoomTypesDto> GetByIdAsync(RTId id)
        {
            var RoomTypes = await this._repo.GetByIdAsync(id);

            if (RoomTypes == null)
                return null;

            return new RoomTypesDto(RoomTypes.ObtainId().AsString(),RoomTypes.ObtainCode().ToString(), RoomTypes.ObtainDesignacao(), RoomTypes.ObtainDescricao(), RoomTypes.ObtainSurgerySuitability());
        }

        public async Task<List<RoomTypesDto>> GetSurgerySuitableActiveAsync()
        {
            var list = await _repo.GetSurgerySuitableActiveAsync();
            
            List<RoomTypesDto> listDto = list.ConvertAll<RoomTypesDto>(RoomTypes =>
                new(RoomTypes.ObtainId().AsString(), RoomTypes.ObtainCode().ToString(), RoomTypes.ObtainDesignacao(), RoomTypes.ObtainDescricao(), RoomTypes.ObtainSurgerySuitability()));

            return listDto;
        }

        public async Task<RoomTypesDto>  AddAsync(CreatingRoomTypesDto createDto)
        {
            // Criação de RoomTypeId
            var roomTypeId = new RoomTypeId(createDto.Code);

            // Criação do RoomTypes
            var roomType = new RoomTypes(roomTypeId, createDto.Designacao, createDto.Descricao, createDto.SurgerySuitable);

            // Persistência no repositório
            await _repo.AddAsync(roomType);

            // Garantir que as mudanças foram salvas
            await _unitOfWork.CommitAsync();

           return new RoomTypesDto(roomType.ObtainId().AsString(),roomType.ObtainCode().ToString(), roomType.ObtainDesignacao(), roomType.ObtainDescricao(), roomType.ObtainSurgerySuitability());
        }

         public async Task<RoomTypesDto> UpdateAsync(RoomTypesDto dto)
        {           

            var roomType = await this._repo.GetByIdAsync(new RTId(dto.RoomTypeId));

            if (roomType == null)
                return null;

            roomType.ChangeDescricao(dto.Descricao);
            roomType.ChangeDesignacao(dto.Designacao);
            roomType.ChangeSurgerySuitable(dto.SurgerySuitable);

            await this._unitOfWork.CommitAsync();

            return new RoomTypesDto(roomType.ObtainId().AsString(),roomType.ObtainCode().ToString(), roomType.ObtainDesignacao(), roomType.ObtainDescricao(), roomType.ObtainSurgerySuitability());
        }

        public async Task<RoomTypesDto> GetByCodeAsync(string code)
        {
            var roomTypes = await this._repo.GetAllAsync();

            var roomType = roomTypes.FirstOrDefault(r => r.ObtainCode().ToString() == code);

            if (roomType == null)
                return null;

            return new RoomTypesDto(
                roomType.ObtainId().AsString(),
                roomType.ObtainCode().ToString(),
                roomType.ObtainDesignacao(),
                roomType.ObtainDescricao(),
                roomType.ObtainSurgerySuitability()
            );
        }



        
    }

    

}