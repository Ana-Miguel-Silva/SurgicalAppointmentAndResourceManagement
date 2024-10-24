using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using Microsoft.AspNetCore.Authorization;
using DDDSample1.Domain.Patients;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly PatientService _service;

        private readonly AuthorizationService _authService;


        public PatientsController(PatientService service, AuthorizationService authService)
        {
            _service = service;
            _authService = authService;
            
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDto>> GetGetById(PatientId id)
        {
            var cat = await _service.GetByIdAsync(id);

            if (cat == null)
            {
                return NotFound();
            }

            return cat;
        }

        // POST: api/Patients
        [HttpPost]
        public async Task<ActionResult<PatientDto>> Create(CreatingPatientDto dto)
        {
            var result = await _service.AddAsync(dto);

            if (result == null)
            {
                return BadRequest("Wasn't possible to create the patient.");
            }

            /*return CreatedAtAction(nameof(GetById), new { id = result. }, new
            {
                Patient = result,
            });*/

            return result;
        }



        /*[HttpPost("login")]
        public async Task<ActionResult<string>> Login([FromBody] LoginRequest login)
        {
            try
            {
                Console.WriteLine($"Username: {login.Username}, Password: {login.Password}");

                var result = await _service.Login(login.Username, login.Password);

                
                return Ok($"Token para autenticação: {result}");
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }*/




        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDto>> GetById(PatientId id)
        {
            var user = await _service.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // PUT: api/Patients/5
        [HttpPut("{id}")]
        public async Task<ActionResult<PatientDto>> Update(Guid id, PatientDto dto)
        {

            Console.Write("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");

            //TODO: Testes e verificar se funciona sem ser com id
            //_authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> {Role.PATIENT}).Result
            if(true){
            Console.Write("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

                try
                {
                    if (id != dto.Id)
                    {
                        return BadRequest();
                    }

            Console.Write("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");

                    try
                    {
                        var patientProfile = await _service.UpdateAsync(dto);
                        
            Console.Write("CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC");


                        if (patientProfile == null)
                        {
                            return NotFound();
                        }
                        return Ok(patientProfile);
                    }
                    catch(BusinessRuleValidationException ex)
                    {
                        return BadRequest(new {Message = ex.Message});
                    }

                }
                    catch(BusinessRuleValidationException ex)
                {
                    return BadRequest(new {Message = ex.Message});
                }
            }
            return Forbid(); 
        }


        /*
        // PUT: api/User/5
        [HttpPut("{id}")]
        public async Task<ActionResult<PatientDto>> Update(PatientId id, PatientDto dto)
        {
            if (id != dto.PatientId)
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
        */

        // POST: api/User/setPassword
        
        /*[HttpPost("setPassword")]
        public async Task<ActionResult> SetUpPassword([FromBody] PasswordRequest passwordRequest)
        {
            var authorizationHeader = Request.Headers["Authorization"].ToString();

            User user;    

            try
            {
                (user) = await _authService.ValidateTokenAsync(authorizationHeader);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }

    
            if (user == null)
            {
                return Unauthorized("Invalid token.");
            }

            try
            {
                await _service.UpdatePassword(user, passwordRequest.Password);
                return Ok("Password has been reset successfully.");
            }
            catch (Exception ex)
            {
                // Handle exceptions related to password update
                return BadRequest($"Error updating password: {ex.Message}");
            }
        }
        */

        /*
        // Inactivate: api/User/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<PatientDto>> SoftDelete(Guid id)
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
        public async Task<ActionResult<PatientDto>> HardDelete(PatientId id)
        {
            try
            {
                var cat = await _service.DeleteAsync(id);

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
    }
}