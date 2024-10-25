using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using Microsoft.AspNetCore.Authorization;
using DDDSample1.Domain.Patients;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.Cookies;
using DDDSample1.Domain.Logging;
using Newtonsoft.Json;
using System.Threading.Tasks.Dataflow;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly PatientService _service;

        private readonly AuthorizationService _authService;

         private readonly LogService _logService;


        public PatientsController(PatientService service, AuthorizationService authService, LogService logService)
        {
            _service = service;
            _authService = authService;
            _logService = logService;

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
             if(_authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> {Role.ADMIN, Role.PATIENT}).Result){
                var result = await _service.AddAsync(dto);

                if (result == null)
                {
                    return BadRequest("Wasn't possible to create the patient.");
                }

                /*return CreatedAtAction(nameof(GetById), new { id = result. }, new
                {
                    Patient = result,
                });*/
                await _logService.LogAsync("Patient", "Created", result.Id, JsonConvert.SerializeObject(result));

                return result;
             }
             return Forbid();
        }

        [HttpPost("ExternalIAM")]
        public async Task<ActionResult<PatientDto>> RegisterExternalIAM()
        {
             ///if(_authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> {Role.PATIENT}).Result){

                /*await HttpContext.ChallengeAsync(GoogleDefaults.AuthenticationScheme,
                    new AuthenticationProperties
                    {
                        RedirectUri = Url.Action("GoogleResponse")
                    });*/


                return Challenge(new AuthenticationProperties
                {
                    RedirectUri = Url.Action("GoogleResponse")
                }, GoogleDefaults.AuthenticationScheme);

             //}
             //return Forbid();
        }

        [HttpGet]
        public async Task<IActionResult> GoogleResponse()
        {

            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (!result.Succeeded || result.Principal == null)
            {
                return Redirect("/erro");
            }

            var claims = result.Principal.Identities.FirstOrDefault()?.Claims.Select(claim => new
            {
                claim.Issuer,
                claim.OriginalIssuer,
                claim.Type,
                claim.Value
            }).ToList();

            // Redireciona para uma URL específica, incluindo as claims caso necessário
            var redirectUrl = "https://team-name-ehehe.postman.co/workspace/f46d55f6-7e50-4557-8434-3949bdb5ccb9/request/38865574-0cea8e40-90a8-416b-8731-d2aefb7713b6?tab=body";
            return Redirect(redirectUrl);
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
        [HttpPut("{email}")]
        public async Task<ActionResult<PatientDto>> Update(string email, PatientDto dto)
        {           

            //TODO: Testes e verificar se funciona sem ser com id
            if(_authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> {Role.ADMIN, Role.PATIENT}).Result){
                
                    try
                    {

                        if (!(email.Equals(dto.Email.FullEmail)))
                        {
                            return BadRequest();
                        }

                        try
                        {
                            var patientProfile = await _service.UpdateAsync(dto);
                            
            
                            if (patientProfile == null)
                            {
                                return NotFound();
                            }

                            await _logService.LogAsync("Patient", "Updated", patientProfile.Id, JsonConvert.SerializeObject(patientProfile));
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

        // GET: api/Patients/search
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetAllFiltered(
            [FromQuery] string? name,
            [FromQuery] DateTime? DateOfBirth,
            [FromQuery] string? medicalRecordNumber,
            [FromQuery] string? email,
            [FromQuery] List<string>? Allergies,
            [FromQuery] List<string>? AppointmentHistory

            )
            //[FromQuery] bool? status)

            
            
        {

            if (_authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> { Role.ADMIN }).Result)
            {
                //MedicalRecordNumber? medicalRecordNumber = !string.IsNullOrEmpty(patientId) ? new MedicalRecordNumber(patientId) : null;
                //OperationTypeId? opTypeId = operationTypeId.HasValue ? new OperationTypeId(operationTypeId.Value) : null;

                var operationRequests = await _service.GetAllFilteredAsync(name,email,DateOfBirth,Allergies,medicalRecordNumber,AppointmentHistory);

                return operationRequests;
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
        
        public async Task<ActionResult<PatientDto>> HardDelete(string id)
        {
            User user = await _authService.ValidateTokenAsync(Request.Headers["Authorization"].ToString());
            if(user != null && _authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> {Role.ADMIN, Role.PATIENT}).Result){
            try
            {
                bool isPatient = false;
                if(user.Role.ToUpper().Equals(Role.PATIENT)){
                    isPatient = true;
                }

                var patientId = new PatientId(Guid.Parse(id));

                var patientProfile = await _service.DeleteAsync(patientId, isPatient);

                await _logService.LogAsync("Patient", "Delete", cat.Id, JsonConvert.SerializeObject(patientProfile));

                if (cat == null)
                {
                    return NotFound();
                }

                return Ok(patientProfile);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        return Forbid();
        }

        }
    }