using System.Threading.Tasks;
using System.Collections.Generic;
using DDDSample1.Domain.Shared;

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
            
            List<UserDto> listDto = list.ConvertAll<UserDto>(cat => new UserDto{Id = cat.Id.AsGuid(), email = cat.email.fullEmail, Username = cat.Username, role = cat.role.ToString()});

            return listDto;
        }

        public async Task<UserDto> GetByIdAsync(UserId id)
        {
            var cat = await this._repo.GetByIdAsync(id);
            
            if(cat == null)
                return null;

            return new UserDto{Id = cat.Id.AsGuid(), email = cat.email.fullEmail, Username = cat.Username, role = cat.role.ToString()};
        }

        
        public async Task<UserDto> AddAsync(CreatingUserDto dto)
        {
            //var User = new User(dto.email.fullEmail, dto.Username, dto.role.ToString());
            var username = string.IsNullOrEmpty(dto.Username) ? dto.email.GetUsername() : dto.Username;

            var User = new User(dto.email.fullEmail, username, dto.role.ToString());

            await this._repo.AddAsync(User);

            await this._unitOfWork.CommitAsync();

            return new UserDto { Id = User.Id.AsGuid(), email = User.email.fullEmail, Username = User.Username, role = User.role.ToString() };
        }


       
        public async Task<UserDto> UpdateAsync(UserDto dto)
        {
            var User = await this._repo.GetByIdAsync(new UserId(dto.Id)); 

            if (User == null)
                return null;   

            // change all field
            User.ChangeEmail(dto.email);
            
            await this._unitOfWork.CommitAsync();

            return new UserDto { Id = User.Id.AsGuid(),  email = User.email.fullEmail, Username = User.Username, role = User.role.ToString()  };
        }

       
         public async Task<UserDto> DeleteAsync(UserId id)
        {
            var User = await this._repo.GetByIdAsync(id); 

            if (User == null)
                return null;   

           /* if (User.Active)
                throw new BusinessRuleValidationException("It is not possible to delete an active User.");
                */
            
            this._repo.Remove(User);
            await this._unitOfWork.CommitAsync();

            return new UserDto { Id = User.Id.AsGuid(), email = User.email.fullEmail, Username = User.Username, role = User.role.ToString() };
        }
    }
}