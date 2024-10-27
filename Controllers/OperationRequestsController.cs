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
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OperationRequestDto>>> GetAll()
        {

            if (_authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> { Role.DOCTOR }).Result)
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
            return Forbid();

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
        [HttpPost]
        public async Task<ActionResult<OperationRequestDto>> Create(CreatingOperationRequestDto dto)
        {
            if (_authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> { Role.DOCTOR }).Result)
            {
                try
                {
                    string userEmail = _authService.GetUserEmail(Request.Headers["Authorization"]).Result.ToString();
                    var operationRequest = await _service.AddAsync(dto, userEmail);


                    await _logService.LogAsync("OperationRequest", "Created", operationRequest.Id, JsonConvert.SerializeObject(dto), userEmail);

                    return CreatedAtAction(nameof(GetGetById), new { id = operationRequest.Id }, operationRequest);
                }
                catch (BusinessRuleValidationException ex)
                {
                    return BadRequest(new { Message = ex.Message });
                }
            }
            return Forbid();
        }


        // GET: api/OperationRequests/search
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<OperationRequestDto>>> GetAllFiltered(
            [FromQuery] string? patientId,
            [FromQuery] string? patientname,
            [FromQuery] Guid? operationTypeId,
            [FromQuery] string? operationTypeName,
            [FromQuery] string? priority,
            [FromQuery] bool? status)
        {
            if (_authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> { Role.DOCTOR }).Result)
            {
                PatientId? medicalRecordNumber = !string.IsNullOrEmpty(patientId) ? new PatientId(patientId) : null;
                OperationTypeId? opTypeId = operationTypeId.HasValue ? new OperationTypeId(operationTypeId.Value) : null;

                var operationRequests = await _service.GetAllFilteredAsync(medicalRecordNumber, opTypeId, status, priority, patientname, operationTypeName);

                return operationRequests;
            }
            return Forbid();
        }



        // PUT: api/OperationRequests/5
        [HttpPut("{id}")]
        public async Task<ActionResult<OperationRequestDto>> Update(Guid id, OperationRequestDto dto)
        {
            if (_authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> { Role.DOCTOR }).Result)
            {
                if (id != dto.Id)
                {
                    return BadRequest();
                }

                try
                {
                    string userEmail = _authService.GetUserEmail(Request.Headers["Authorization"]).Result.ToString();

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
            return Forbid();
        }

        // Inactivate: api/OperationRequests/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<OperationRequestDto>> SoftDelete(Guid id)
        {
            if (_authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> { Role.DOCTOR }).Result)
            {

                var operationRequest = await _service.InactivateAsync(new OperationRequestId(id));

                if (operationRequest == null)
                {
                    return NotFound();
                }

                return Ok(operationRequest);

            }
            return Forbid();
        }

        // DELETE: api/OperationRequests/5
        [HttpDelete("{id}/hard")]
        public async Task<ActionResult<OperationRequestDto>> HardDelete(Guid id)
        {
            if (_authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> { Role.DOCTOR }).Result)
            {
                try
                {
                    string userEmail = _authService.GetUserEmail(Request.Headers["Authorization"]).Result.ToString();

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
            return Forbid();
        }

    }
}