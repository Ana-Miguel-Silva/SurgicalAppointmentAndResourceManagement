using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using DDDSample1.ApplicationService.Users;
using DDDSample1.ApplicationService.Shared;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserService _service;
        private readonly AuthorizationService _authService;
        private readonly IMailService _mailService;


        public UsersController(UserService service, AuthorizationService authService)
        {
            _service = service;
            _authService = authService;
            
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        /*// GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetGetById(Guid id)
        {
            var cat = await _service.GetByIdAsync(new UserId(id));

            if (cat == null)
            {
                return NotFound();
            }

            return cat;
        }*/

        // POST: api/Users
        [HttpPost]
        public async Task<ActionResult<UserDto>> Create(CreatingUserDto dto)
        {

            if(dto != null && _authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> {Role.ADMIN}).Result){
                var result = await _service.AddAsync(dto);

                if (result == null)
                {
                    return BadRequest("Wasn't possible to create the user.");
                }
               
                return result;

            }

            return Forbid();

            
        }



        [HttpPost("login")]
        public async Task<ActionResult<string>> Login([FromBody] LoginRequest login)
        {
            try
            {
                Console.WriteLine($"Username: {login.Username}, Password: {login.Password}");

                var user = await _service.Login(login.Username, login.Password);

                var token = _authService.GenerateToken(user);

                
                return Ok($"Token para autenticação: {token}");
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }




        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetById(Guid id)
        {
            var user = await _service.GetByIdAsync(new UserId(id));
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }


    
        // PUT: api/User/5
        [HttpPut("{id}")]
        public async Task<ActionResult<UserDto>> Update(Guid id, UserDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var cat = await _service.UpdateAsync(dto);
                
                if (cat == null)
                {
                    return NotFound();
                }
                return Ok(cat);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }



        /*
        // Inactivate: api/User/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<UserDto>> SoftDelete(Guid id)
        {
            var cat = await _service.InactivateAsync(new UserId(id));

            if (cat == null)
            {
                return NotFound();
            }

            return Ok(cat);
        }
        */
        
        // DELETE: api/User/5
        [HttpDelete("{id}/hard")]
        public async Task<ActionResult<UserDto>> HardDelete(Guid id)
        {
            try
            {
                var cat = await _service.DeleteAsync(new UserId(id));

                if (cat == null)
                {
                    return NotFound();
                }

                return Ok(cat);
            }
            catch(BusinessRuleValidationException ex)
            {
               return BadRequest(new {Message = ex.Message});
            }
        }

        [HttpPost("recover")]
        public async Task<ActionResult> recoverPassword([FromBody] RecoverPasswordRequest Email) {
            UserDto user = await _service.GeBbyEmailAsync(Email.Text);

            if (user == null) return BadRequest("The user email is not registered in the system.");

            var token = _authService.GenerateToken(user);

            var verificationLinkRegister = $"https://team-name-ehehe.postman.co/workspace/f46d55f6-7e50-4557-8434-3949bdb5ccb9/request/38865574-0cea8e40-90a8-416b-8731-d2aefb7713b6";
            var emailRequestRegister = new SendEmailRequest(Email.Text, "Recover your Password in Medical Appointment Management", $"Token para autenticação: {token}\r\rPlease copy the token and recover your Password by clicking here: {verificationLinkRegister}");
            await _mailService.SendEmailAsync(emailRequestRegister);

                return Ok("Recovery email sent. Please check your inbox.");

        }
        public class RecoverPasswordRequest
        {
            public string Text { get; set; }
        }
        // POST: api/User/setPassword
        [HttpPost("setPassword")]
        public async Task<ActionResult> ResetPassword([FromBody] RecoverPasswordRequest Password) {
            User user = await _authService.ValidateTokenAsync(Request.Headers["Authorization"].ToString());
            try
            {
                await _service.UpdatePassword(user.Username, Password.Text);
                return Ok("Password has been reset successfully.");
            }
            catch (Exception ex)
            {
                // Handle exceptions related to password update
                return BadRequest($"Error updating password: {ex.Message}");
            }
        }

    }
}