using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;

namespace DDDSample1.Domain.Users
{
    public class UserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _repo;

        public UserService(IUnitOfWork unitOfWork, IUserRepository repo)
        {
            this._unitOfWork = unitOfWork;
            this._repo = repo;
        }

        public async Task<List<UserDto>> GetAllAsync()
        {
            var list = await this._repo.GetAllAsync();

            List<UserDto> listDto = list.ConvertAll<UserDto>(user =>
                new(user.Id.AsGuid(), user.Username, user.Email, user.Role));

            return listDto;
        }

        public async Task<UserDto> GetByIdAsync(UserId id)
        {
            var user = await this._repo.GetByIdAsync(id);

            if (user == null)
                return null;

            return new UserDto(user.Id.AsGuid(), user.Username, user.Email, user.Role);
        }

        public async Task<UserDto> AddAsync(CreatingUserDto dto)
        {

            CheckRole(dto.Role);

            var user = new User(dto.Username, dto.Email, dto.Role);

            await this._repo.AddAsync(user);

            await this._unitOfWork.CommitAsync();

            return new UserDto(user.Id.AsGuid(), user.Username, user.Email, user.Role);
        }

        public async Task<UserDto> UpdateAsync(UserDto dto)
        {

            var user = await this._repo.GetByIdAsync(new UserId(dto.Id));

            if (user == null)
                return null;

            // change deadline and priority
            user.ChangeEmail(dto.Email);

            await this._unitOfWork.CommitAsync();

            return new UserDto(user.Id.AsGuid(), user.Username, user.Email, user.Role);
        }

        public async Task<UserDto> InactivateAsync(UserId id)
        {
            var user = await this._repo.GetByIdAsync(id);

            if (user == null)
                return null;

            user.MarkAsInative();

            await this._unitOfWork.CommitAsync();

            return new UserDto(user.Id.AsGuid(), user.Username, user.Email, user.Role);
        }

        public async Task<UserDto> DeleteAsync(UserId id)
        {
            var user = await this._repo.GetByIdAsync(id);

            if (user == null)
                return null;

            if (user.Active)
                throw new BusinessRuleValidationException("It is not possible to delete an active user.");

            this._repo.Remove(user);
            await this._unitOfWork.CommitAsync();

            return new UserDto(user.Id.AsGuid(), user.Username, user.Email, user.Role);
        }

        private static void CheckRole(String role)
        {
            if (!Role.IsValid(role.ToUpper()))
                throw new BusinessRuleValidationException("Invalid Role.");
        }

    }
}