using DDDSample1.Domain.Shared;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;

namespace DDDSample1.Domain.Users
{
    public class UserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _repo;
        private readonly IMailService _mailService;

        private readonly JwtSettings _jwtSettings;

        public UserService(IUnitOfWork unitOfWork, IUserRepository userRepository, IMailService mailService, IOptions<JwtSettings> jwtSettings)
        {
            _unitOfWork = unitOfWork;
            _repo = userRepository;
            _mailService = mailService;
            _jwtSettings = jwtSettings.Value;
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
            

            var emailObject = new Email(dto.Email);
            CheckRole(dto.Role);
            var user = new User(dto.Username, emailObject, dto.Role);

            await _repo.AddAsync(user);
            await _unitOfWork.CommitAsync();

            // Gera o token e calcula os tempos
            /*
            var token = GenerateToken(user);
            var currentTime = DateTime.UtcNow;
            double time = _jwtSettings.TokenExpiryInMinutes;
            var expirationTime = currentTime.AddMinutes(_jwtSettings.TokenExpiryInMinutes);
            */

            await SendPasswordSetupEmail(user);

            // Retorna as informações como uma tupla
            return new UserDto(user.Id.AsGuid(), user.Username, user.Email, user.Role);
        }



        private async Task SendPasswordSetupEmail(User user)
        {

            //var token = GenerateToken(user);

            var resetLink = $"https://team-name-ehehe.postman.co/workspace/f46d55f6-7e50-4557-8434-3949bdb5ccb9/request/38833556-d2be1ab7-de01-46ca-8a52-93ab95f42312?tab=body";

            var body = $"Hello {user.Username},<br>\n" +
                    "You requested to set up your password for your Health App account.\r\n" +
                    "<br>Please click on the following link to set up your password:\r\n\n" +
                    $"{resetLink}<br>\r\n\n" +                    
                    "<br>If you did not request this, please ignore this email.\r\n";

            var sendEmailRequest = new SendEmailRequest(
                user.Email.FullEmail, // Destinatário
                "Health App - Set Up Your Password", // Assunto
                body // Corpo
            );

            await _mailService.SendEmailAsync(sendEmailRequest);
        }



        public async Task UpdatePassword(string username, string newPassword)
        {
            try
            {
                var users = await _repo.GetByUsernameAsync(username);      

                var user = users.FirstOrDefault();

                user.SetPassword(newPassword);

            }
            catch (ArgumentException ex)
            {
                throw new Exception("Password does not meet the required format.", ex);
            }

            try
            {
                await this._unitOfWork.CommitAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while updating the password.", ex);
            }
        }

        public async Task<UserDto> Login(string username, string password)
        {

            var users = await _repo.GetByUsernameAsync(username);      

            var user = users.FirstOrDefault();

            if (user == null)
            {
                throw new Exception("User not found.");
            }

            if (!user.CheckPassword(password))
            {
                throw new Exception("Invalid password.");
            }

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

        public static void CheckRole(String role)
        {
            if (!Role.IsValid(role.ToUpper()))
                throw new BusinessRuleValidationException("Invalid Role.");
        }

    }


}