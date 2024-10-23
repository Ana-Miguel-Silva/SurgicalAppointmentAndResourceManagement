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
        public async Task<ActionResult<PatientDto>> GetGetById(MedicalRecordNumber id)
        {
            var cat = await _service.GetByIdAsync(id);

            if (cat == null)
            {
                return NotFound();
            }

            return cat;
        }

        // POST: api/User
        [HttpPost]
        public async Task<ActionResult<object>> Create(CreatingPatientDto dto)
        {
            var result = await _service.AddAsync(dto);

            if (result == null)
            {
                return BadRequest("Não foi possível criar o pacient.");
            }

            // Retorna as informações no formato esperado
            return CreatedAtAction(nameof(GetById), new { id = result.medicalRecordNumber }, new
            {
                Patient = result,
            });
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
        public async Task<ActionResult<PatientDto>> GetById(MedicalRecordNumber id)
        {
            var user = await _service.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }


    
        // PUT: api/User/5
        [HttpPut("{id}")]
        public async Task<ActionResult<PatientDto>> Update(MedicalRecordNumber id, PatientDto dto)
        {
            if (id != dto.medicalRecordNumber)
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
        public async Task<ActionResult<PatientDto>> HardDelete(MedicalRecordNumber id)
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