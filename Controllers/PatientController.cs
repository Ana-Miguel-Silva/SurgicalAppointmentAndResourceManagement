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
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.JsonPatch;

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

        // GET: api/Patients/5
        /*[HttpGet("{id}")]
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
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN},{Role.PATIENT}")]


        [HttpPost("register")]

        public async Task<ActionResult<PatientDto>> Create(CreatingPatientDto dto)
        {

                var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var user = await _userService.GetByIdAsync(new UserId(userId));
                var result = await _service.AddAsync(dto,user.Role.ToString());

                if (result == null)
                {
                    return BadRequest("Wasn't possible to create the patient.");
                }

                /*return CreatedAtAction(nameof(GetById), new { id = result. }, new
                {
                    Patient = result,
                });*/

                string userEmail = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;

                await _logService.LogAsync("Patient", "Created", result.Id, JsonConvert.SerializeObject(result), userEmail);

                return result;
           
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
                var verificationLinkRegister = $"http://localhost:4200/user?email={emailClaim}";

                var emailRequestRegister = new SendEmailRequest(emailClaim, "Register in Medical Appointment Management", $"Please verify your register by clicking here: {verificationLinkRegister}");

                await _mailService.SendEmailAsync(emailRequestRegister);

                return Ok("Registation email sent. Please check your inbox.");
            }

            UserDto user = await _userService.GeBbyEmailAsync(patientRecord.UserEmail.FullEmail);

            if (user == null) return BadRequest("The user email is not registed in the sistem.");

            if(user.Role.ToUpper() != Role.PATIENT) return BadRequest("The user email is not associated to a Patient");

            var token = _authService.GenerateToken(user);
            var redirectUrl = $"http://localhost:4200/patient?token={token}";

            return Redirect(redirectUrl);

        }


        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDto>> GetById(string id)
        {
            var user = await _service.GetByIdAsync(new PatientId(id));
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }


        [HttpGet("email/{email}")]
        public async Task<ActionResult<PatientDto>> GetByEmail(string email)
        {
            var user = await _service.GetPatientByEmailAsync(email);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // PUT: api/Patients/5
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN},{Role.PATIENT}")]

        [HttpPut("{email}")]
        public async Task<ActionResult<PatientDto>> Update(string email, PatientDto dto)
        {



            //TODO: Testes e verificar se funciona sem ser com id
            
           // if (_authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> { Role.ADMIN, Role.PATIENT }).Result)
            {
                try
                { 

                //User user = await _authService.ValidateTokenAsync(Request.Headers["Authorization"].ToString());
                var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var user = await _userService.GetByIdAsync(new UserId(userId));

                    try
                    {
                        var sendEmail = await _service.VerifySensiveData(dto, email);

                        if(sendEmail.ToString().Equals("1")){


                            // Monta o nome completo como uma string
                            string fullName = $"{dto.name.FirstName} {dto.name.MiddleNames} {dto.name.LastName}";

                            var transformedDto = new
                            {
                                name = fullName,
                                Id = dto.Id,
                                DateOfBirth = dto.DateOfBirth,
                                medicalRecordNumber = dto.medicalRecordNumber,
                                gender = dto.gender,
                                Allergies = dto.Allergies,
                                AppointmentHistory = dto.AppointmentHistory,
                                nameEmergency = dto.nameEmergency,
                                phoneEmergency = dto.phoneEmergency,
                                emailEmergency = dto.emailEmergency,
                                Phone = dto.Phone,
                                Email = dto.Email,
                                UserEmail = dto.UserEmail
                            };

                            var pendingAction = await _pendingActionsService.PendingActionsAsync(JsonConvert.SerializeObject(transformedDto));

                            await _service.SendConfirmationUpdateEmail(email, pendingAction.Id.AsString());

                            return Ok("Please check your email to confirm this action");

                        } else if(sendEmail.ToString().Equals("0")){


                            var patientProfile = await _service.UpdateAsync(dto,email);

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

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN},{Role.PATIENT}")]

        [HttpPatch("{email}")]
        public async Task<ActionResult<PatientDto>> UpdatePatch(string email, PatientDto dto)
        {

                try
                { 

                //User user = await _authService.ValidateTokenAsync(Request.Headers["Authorization"].ToString());
                var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var user = await _userService.GetByIdAsync(new UserId(userId));

                    try
                    {
                        var sendEmail = await _service.VerifySensiveData(dto, email);

                        if(sendEmail.ToString().Equals("1")){


                            // Monta o nome completo como uma string
                            string fullName = $"{dto.name.FirstName} {dto.name.MiddleNames} {dto.name.LastName}";

                            var transformedDto = new
                            {
                                name = fullName,
                                Id = dto.Id,
                                DateOfBirth = dto.DateOfBirth,
                                medicalRecordNumber = dto.medicalRecordNumber,
                                gender = dto.gender,
                                Allergies = dto.Allergies,
                                AppointmentHistory = dto.AppointmentHistory,
                                nameEmergency = dto.nameEmergency,
                                phoneEmergency = dto.phoneEmergency,
                                emailEmergency = dto.emailEmergency,
                                Phone = dto.Phone,
                                Email = dto.Email,
                                UserEmail = dto.UserEmail
                            };

                            var pendingAction = await _pendingActionsService.PendingActionsAsync(JsonConvert.SerializeObject(transformedDto));

                            await _service.SendConfirmationUpdateEmail(email, pendingAction.Id.AsString());

                            return Ok("Please check your email to confirm this action");

                        } else if(sendEmail.ToString().Equals("0")){


                            var patientProfile = await _service.UpdateAsync(dto,email);

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





        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN},{Role.PATIENT}")]

        [HttpPut("{actionId}/Confirmed")]
        public async Task<ActionResult<PatientDto>> UpdateConfirmed(string actionId)
        {

            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userService.GetByIdAsync(new UserId(userId));
                //User user = await _authService.ValidateTokenAsync(Request.Headers["Authorization"].ToString());
            //if (_authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> { Role.ADMIN, Role.PATIENT }).Result)
            {

                try
                {
                    try
                    {
                        var pendingActionsId = new PendingActionsId(Guid.Parse(actionId));
                        var action = await _pendingActionsService.FindbyId(pendingActionsId);

                        //string replace = action.Replace("{\"FirstName\":", "").Replace("\",\"MiddleNames\":\""," ").Replace("\",\"LastName\":\""," ").Replace("},\"Id\":", ",\"Id\":");
                        
                        PatientDto patientDto = JsonConvert.DeserializeObject<PatientDto>(action);

                        var pendingActionExists = await _pendingActionsService.TryRemove(pendingActionsId);
                                                     
                        
                        if(pendingActionExists.ToString().Equals("True")){


                           
                            var patientProfile = await _service.UpdateAsync(patientDto,user.Email.FullEmail);

                            string userEmail =HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;


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
       [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN}")]
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetAllFiltered(
            [FromQuery] string? name,
            [FromQuery] Guid? id,
            [FromQuery] DateTime? DateOfBirth,
            [FromQuery] string? medicalRecordNumber,
            [FromQuery] string? email,
            [FromQuery] List<string>? Allergies,
            [FromQuery] List<string>? AppointmentHistory

            )
        //[FromQuery] bool? status)



        {

            //if (_authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> { Role.ADMIN }).Result)
            {

                //MedicalRecordNumber? medicalRecordNumber = !string.IsNullOrEmpty(patientId) ? new MedicalRecordNumber(patientId) : null;
                //OperationTypeId? opTypeId = operationTypeId.HasValue ? new OperationTypeId(operationTypeId.Value) : null;

                var operationRequests = await _service.GetAllFilteredAsync(id,name, email, DateOfBirth, Allergies, medicalRecordNumber, AppointmentHistory);

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
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN},{Role.PATIENT}")]

        [HttpDelete("{id}/hard")]

        public async Task<ActionResult<PatientDto>> HardDelete(string id)
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userService.GetByIdAsync(new UserId(userId));
        
                try
                {
                    string userEmail =HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;


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



        //Delete with actions
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN},{Role.PATIENT}")]

        [HttpDelete("{id}/delete")]
        public async Task<ActionResult<PatientDto>> DeleteConfirmationAction(string id)
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userService.GetByIdAsync(new UserId(userId));
            
                try
                {

                    var patientId = new PatientId(Guid.Parse(id));

                    var pendingAction = await _pendingActionsService.PendingActionsAsync(id);


                    await _service.SendConfirmationEmail(user.Email.FullEmail, pendingAction.Id.AsString());


                    return Ok("Please check your email to confirm this action");
                }
                catch (BusinessRuleValidationException ex)
                {
                    return BadRequest(new { Message = ex.Message });
                }
            

            
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN},{Role.PATIENT}")]


        [HttpDelete("{actionId}/deleteConfirmed")]
        public async Task<ActionResult<PatientDto>> DeleteConfirmed(string actionId)
        {
            var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userService.GetByIdAsync(new UserId(userId));
            
                try
                {

               var pendingActionsId = new PendingActionsId(Guid.Parse(actionId));
               var action = await _pendingActionsService.FindbyId(pendingActionsId);



               var pendingActionExists = await _pendingActionsService.TryRemove(pendingActionsId);

               if(pendingActionExists.ToString().Equals("True")){


                    var patientId = new PatientId(Guid.Parse(action.ToString()));

                        var patientProfile = await _service.DeactiveAsync(patientId);


                        if (patientProfile != null){
                           string userEmail =HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;


                            await _logService.LogAsync("Patient", "Deactivate", patientProfile.Id, JsonConvert.SerializeObject(patientProfile), userEmail);

                            if (patientProfile == null)
                            {
                                return NotFound();
                            }

                            return Ok(patientProfile);
                        }

                       return BadRequest("The patient is already deactivated.");

                    }

                    return BadRequest("Was not possible to delete the patient.");

                }
                catch (BusinessRuleValidationException ex)
                {
                    return BadRequest(new { Message = ex.Message });
                }
           
        }


    }
}