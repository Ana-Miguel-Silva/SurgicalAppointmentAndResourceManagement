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
using DDDSample1.Domain.PendingActions;
using Newtonsoft.Json;
using System.Threading.Tasks.Dataflow;
using System.Security.Claims;
using DDDSample1.ApplicationService.Users;
using DDDSample1.ApplicationService.Patients;
using DDDSample1.ApplicationService.Logging;
using DDDSample1.ApplicationService.Shared;
using DDDSample1.ApplicationService.PendingActions;
using Newtonsoft.Json;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly PatientService _service;

        private readonly AuthorizationService _authService;

        private readonly LogService _logService;

        private readonly IMailService _mailService;

        private readonly PendingActionsService _pendingActionsService;
        private readonly UserService _userService;


        public PatientsController(PatientService service, AuthorizationService authService, LogService logService, IMailService mailService, PendingActionsService pendingActionsService, UserService userService)
        {
            _service = service;
            _authService = authService;
            _logService = logService;
            _mailService = mailService;
            _pendingActionsService = pendingActionsService;
            _userService = userService;

        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        /*// GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDto>> GetGetById(PatientId id)
        {
            var cat = await _service.GetByIdAsync(id);

            if (cat == null)
            {
                return NotFound();
            }

            return cat;
        }*/

        // POST: api/Patients
        [HttpPost("register")]
        public async Task<ActionResult<PatientDto>> Create(CreatingPatientDto dto)
        {
            if (_authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> { Role.ADMIN, Role.PATIENT }).Result)
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

                string userEmail = _authService.GetUserEmail(Request.Headers["Authorization"]).Result.ToString();

                await _logService.LogAsync("Patient", "Created", result.Id, JsonConvert.SerializeObject(result), userEmail);

                return result;
            }
            return Forbid();
        }

        [HttpGet("ExternalIAM")]
        public async Task<ActionResult<PatientDto>> ExternalIAM()
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

        [HttpPost("ExternalIAMRegister")]
        public async Task<ActionResult<PatientDto>> ExternalIAMRegister(CreatingPatientDto dto)
        {
                var result = await _service.AddAsync(dto);

                if (result == null)
                {
                    return BadRequest("Wasn't possible to create the patient.");
                }

                await _logService.LogAsync("Patient", "Created", result.Id, JsonConvert.SerializeObject(result), result.UserEmail.FullEmail);

                return result;
        }

        [HttpGet("signin-google")]
        public async Task<IActionResult> GoogleResponse()
        {

            var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

            if (!result.Succeeded || result.Principal == null)
            {
                return Redirect("/error");
            }

            // Extract user information from claims
            var emailClaim = result.Principal.FindFirst(ClaimTypes.Email)?.Value;
            var nameClaim = result.Principal.FindFirst(ClaimTypes.Name)?.Value;


            var patientRecord = await _service.GetPatientByEmailAsync(emailClaim);

            if (patientRecord == null)
            {
                var verificationLinkRegister = $"https://team-name-ehehe.postman.co/workspace/f46d55f6-7e50-4557-8434-3949bdb5ccb9/request/38865574-0cea8e40-90a8-416b-8731-d2aefb7713b6";

                var emailRequestRegister = new SendEmailRequest(emailClaim, "Register in Medical Appointment Management", $"Please verify your register by clicking here: {verificationLinkRegister}");

                await _mailService.SendEmailAsync(emailRequestRegister);

                return Ok("Registation email sent. Please check your inbox.");
            }

            //TODO: Erro é aqui, como buscar o token ? ou criar outro 
            UserDto user = await _userService.GeBbyEmailAsync(patientRecord.UserEmail.FullEmail);

            if (user == null) return BadRequest("The user email is not registed in the sistem.");

            if(user.Role.ToUpper() != Role.PATIENT) return BadRequest("The user email is not associated to a Patient");

            var token = _authService.GenerateToken(user);

            var redirectUrl = $"https://team-name-ehehe.postman.co/workspace/f46d55f6-7e50-4557-8434-3949bdb5ccb9/collection/38865574-d91a5651-b072-4ff8-b9ed-42c79b7c808c";

            return Ok($"Token para autenticação: {token} \r\r Please copy the token and click here: " + redirectUrl);

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
            User user = await _authService.ValidateTokenAsync(Request.Headers["Authorization"].ToString());
            if (_authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> { Role.ADMIN, Role.PATIENT }).Result)
            {
                try
                {                  

                    try
                    {
                        var sendEmail = _service.VerifySensiveData(dto, email);

                        if(sendEmail.Equals(1)){

                            var pendingAction = await _pendingActionsService.PendingActionsAsync(JsonConvert.SerializeObject(dto));

                            await _service.SendConfirmationUpdateEmail(user, pendingAction.Id.AsString());

                            return Ok("Please check your email to confirm this action");

                        } else if(sendEmail.Equals(0)){

                            var patientProfile = await _service.UpdateAsync(dto);

                            await _logService.LogAsync("Patient", "Updated", patientProfile.Id, "old" + JsonConvert.SerializeObject(patientProfile) + "new" + JsonConvert.SerializeObject(dto), user.Email.FullEmail);

                            return Ok(patientProfile);
                        }
                        return BadRequest("The patient was not found");

                                               
                    }
                    catch (BusinessRuleValidationException ex)
                    {
                        return BadRequest(new { Message = ex.Message });
                    }

                }
                catch (BusinessRuleValidationException ex)
                {
                    return BadRequest(new { Message = ex.Message });
                }

            }
            return Forbid();
        }


        [HttpPut("{actionId}/Confirmed")]
        public async Task<ActionResult<PatientDto>> UpdateConfirmed(string actionId, PatientDto dto)
        {

            User user = await _authService.ValidateTokenAsync(Request.Headers["Authorization"].ToString());
            if (_authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> { Role.ADMIN, Role.PATIENT }).Result)
            {

                try
                {
                    try
                    {
                        var pendingActionsId = new PendingActionsId(Guid.Parse(actionId));
                        var action = await _pendingActionsService.FindbyId(pendingActionsId);

                        var pendingActionExists = await _pendingActionsService.TryRemove(pendingActionsId);
                             
                        
                        if(pendingActionExists.ToString().Equals("True")){

                           
                            var patientProfile = await _service.UpdateAsync(dto);

                            string userEmail = _authService.GetUserEmail(Request.Headers["Authorization"]).Result.ToString();


                            await _logService.LogAsync("Patient", "Update", patientProfile.Id, JsonConvert.SerializeObject(patientProfile), userEmail);

                            if (patientProfile == null)
                            {
                                return NotFound();
                            }

                            return Ok(patientProfile);

                        }

                        return BadRequest("Was not possible to update the patient.");

                
                    }
                    catch (BusinessRuleValidationException ex)
                    {
                        return BadRequest(new { Message = ex.Message });
                    }

                }
                catch (BusinessRuleValidationException ex)
                {
                    return BadRequest(new { Message = ex.Message });
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
            Console.Write("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");

                //MedicalRecordNumber? medicalRecordNumber = !string.IsNullOrEmpty(patientId) ? new MedicalRecordNumber(patientId) : null;
                //OperationTypeId? opTypeId = operationTypeId.HasValue ? new OperationTypeId(operationTypeId.Value) : null;

                var operationRequests = await _service.GetAllFilteredAsync(name, email, DateOfBirth, Allergies, medicalRecordNumber, AppointmentHistory);

                return operationRequests;
            }

            Console.Write("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXdDDDDDdDDD");

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
            if (user != null && _authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> { Role.ADMIN, Role.PATIENT }).Result)
            {
                try
                {
                    string userEmail = _authService.GetUserEmail(Request.Headers["Authorization"]).Result.ToString();


                    bool isPatient = false;
                    if (user.Role.ToUpper().Equals(Role.PATIENT))
                    {
                        isPatient = true;
                    }

                    var patientId = new PatientId(Guid.Parse(id));

                    var patientProfile = await _service.DeleteAsync(patientId);

                    await _logService.LogAsync("Patient", "Delete", patientProfile.Id, JsonConvert.SerializeObject(patientProfile), userEmail);

                    if (patientProfile == null)
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



        //Delete with actions
        [HttpDelete("{id}/delete")]
        public async Task<ActionResult<PatientDto>> DeleteConfirmationAction(string id)
        {
            User user = await _authService.ValidateTokenAsync(Request.Headers["Authorization"].ToString());
            if (user != null && _authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> { Role.ADMIN, Role.PATIENT }).Result)
            {
                try
                {

                    var patientId = new PatientId(Guid.Parse(id));

                    var pendingAction = await _pendingActionsService.PendingActionsAsync(id);


                    await _service.SendConfirmationEmail(user, pendingAction.Id.AsString());


                    return Ok("Please check your email to confirm this action");
                }
                catch (BusinessRuleValidationException ex)
                {
                    return BadRequest(new { Message = ex.Message });
                }
            }

            return Forbid();
        }

        [HttpDelete("{actionId}/deleteConfirmed")]
        public async Task<ActionResult<PatientDto>> DeleteConfirmed(string actionId)
        {
            User user = await _authService.ValidateTokenAsync(Request.Headers["Authorization"].ToString());
            if (user != null && _authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> { Role.ADMIN, Role.PATIENT }).Result)
            {
                try
                {

               var pendingActionsId = new PendingActionsId(Guid.Parse(actionId));
               var action = await _pendingActionsService.FindbyId(pendingActionsId);



               var pendingActionExists = await _pendingActionsService.TryRemove(pendingActionsId);

            Console.Write("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
            Console.Write(pendingActionsId.AsString() + " ahahah \n");
            Console.Write(pendingActionExists + " v2 ahahah \n");

               if(pendingActionExists.ToString().Equals("True")){

                    var patientId = new PatientId(Guid.Parse(action.ToString()));

                        var patientProfile = await _service.DeleteAsync(patientId);

                        string userEmail = _authService.GetUserEmail(Request.Headers["Authorization"]).Result.ToString();


                        await _logService.LogAsync("Patient", "Delete", patientProfile.Id, JsonConvert.SerializeObject(patientProfile), userEmail);

                        if (patientProfile == null)
                        {
                            return NotFound();
                        }

                        return Ok(patientProfile);

                    }

                    return BadRequest("Was not possible to delete the patient.");

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