using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.OperationTypes;
using Newtonsoft.Json;
using DDDSample1.ApplicationService.OperationRequests;
using DDDSample1.ApplicationService.Logging;
using DDDSample1.ApplicationService.Shared;
using DDDSample1.Domain.Patients;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;


namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationRequests : ControllerBase
    {
        private readonly OperationRequestService _service;

        private readonly AuthorizationService _authService;

        private readonly LogService _logService;

        public OperationRequests(OperationRequestService service, AuthorizationService authService, LogService logService)
        {
            _authService = authService;
            _service = service;
            _logService = logService;
        }

        // GET: api/OperationRequests
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.DOCTOR}")]
        [HttpGet("NotScheduled")]
        public async Task<ActionResult<IEnumerable<OperationRequestUIDto>>> GetAllNotScheduledAsync()
        {
            try
            {
                return await _service.GetAllNotScheduledAsync();
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }

        }


        // GET: api/OperationRequests/UI
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.DOCTOR}")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OperationRequestUIDto>>> GetAll()
        {
            try
            {
                return await _service.GetAllAsync();
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }

        }

        // GET: api/OperationRequests/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OperationRequestDto>> GetGetById(Guid id)
        {
            var operationRequest = await _service.GetByIdAsync(new OperationRequestId(id));

            if (operationRequest == null)
            {
                return NotFound();
            }

            return operationRequest;
        }

        // POST: api/OperationRequests
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.DOCTOR}")]
        [HttpPost]
        public async Task<ActionResult<OperationRequestDto>> Create(CreatingOperationRequestUIDto dto)
        {

            try
            {
                string userEmail = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;
                var operationRequest = await _service.AddAsync(dto, userEmail);


                await _logService.LogAsync("OperationRequest", "Created", operationRequest.Id, JsonConvert.SerializeObject(dto), userEmail);

                return CreatedAtAction(nameof(GetGetById), new { id = operationRequest.Id }, operationRequest);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }

        }


        // GET: api/OperationRequests/search
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.DOCTOR}")]
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<OperationRequestUIDto>>> GetAllFiltered(
            [FromQuery] string? patientId,
            [FromQuery] string? patientname,
            [FromQuery] Guid? operationTypeId,
            [FromQuery] string? operationTypeName,
            [FromQuery] string? priority,
            [FromQuery] bool? status)
        {
            PatientId? medicalRecordNumber = !string.IsNullOrEmpty(patientId) ? new PatientId(patientId) : null;
            OperationTypeId? opTypeId = operationTypeId.HasValue ? new OperationTypeId(operationTypeId.Value) : null;

            var operationRequests = await _service.GetAllFilteredAsync(medicalRecordNumber, opTypeId, status, priority, patientname, operationTypeName);

            return operationRequests;

        }



        // PATCH: api/OperationRequests/5
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.DOCTOR}")]
        [HttpPatch("{id}")]
        public async Task<ActionResult<OperationRequestDto>> Update(Guid id, UpdateOperationRequestDto dto)
        {

            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                string userEmail = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;

                var operationRequestOld = await _service.GetByIdAsync(new OperationRequestId(id));

                var operationRequest = await _service.UpdateAsync(dto, userEmail);



                await _logService.LogAsync("OperationRequest", "Updated", operationRequest.Id, "old" + JsonConvert.SerializeObject(operationRequestOld) + "new" + JsonConvert.SerializeObject(dto), userEmail);

                if (operationRequest == null)
                {
                    return NotFound();
                }
                return Ok(operationRequest);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }

        }

        // Inactivate: api/OperationRequests/5/soft
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.DOCTOR}")]
        [HttpDelete("{id}/soft")]
        public async Task<ActionResult<OperationRequestDto>> SoftDelete(Guid id)
        {


            var operationRequest = await _service.InactivateAsync(new OperationRequestId(id));

            if (operationRequest == null)
            {
                return NotFound();
            }

            return Ok(operationRequest);


        }

        // DELETE: api/OperationRequests/5
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.DOCTOR}")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<OperationRequestDto>> HardDelete(Guid id)
        {
            try
            {
                string userEmail = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;

                var operationRequest = await _service.DeleteAsync(new OperationRequestId(id));

                await _logService.LogAsync("OperationRequest", "Deleted", operationRequest.Id, JsonConvert.SerializeObject(operationRequest), userEmail);

                if (operationRequest == null)
                {
                    return NotFound();
                }

                return Ok(operationRequest);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }

        }

    }
}