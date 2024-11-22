using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Users;
using Newtonsoft.Json;
using DDDSample1.ApplicationService.OperationTypes;
using DDDSample1.ApplicationService.Logging;
using DDDSample1.ApplicationService.Shared;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;


namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationTypes : ControllerBase
    {
        private readonly OperationTypeService _service;
        private readonly AuthorizationService _authService;
        private readonly LogService _logService;



        public OperationTypes(OperationTypeService service, AuthorizationService authService, LogService logService)
        {
            _authService = authService;
            _service = service;
            _logService = logService;

        }

        // GET: api/OperationTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OperationTypeDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/OperationTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OperationTypeDto>> GetGetById(Guid id)
        {
            var operationType = await _service.GetByIdAsync(new OperationTypeId(id));

            if (operationType == null)
            {
                return NotFound();
            }

            return operationType;
        }

        // POST: api/OperationTypes
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN}")]
        [HttpPost]
        public async Task<ActionResult<OperationTypeDto>> Create(CreatingOperationTypeDto dto)
        {
            
                try
                {
                    var operationType = await _service.AddAsync(dto);

                    string userEmail =HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;


                    await _logService.LogAsync("OperationRequest", "Created", operationType.Id, JsonConvert.SerializeObject(dto), userEmail);

                    return CreatedAtAction(nameof(GetGetById), new { id = operationType.Id }, operationType);
                }
                catch (BusinessRuleValidationException ex)
                {
                    return BadRequest(new { Message = ex.Message });
                }
            
        }


        // PUT: api/OperationTypes/5
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN}")]
        [HttpPatch("{id}")]
        public async Task<ActionResult<OperationTypeDto>> Update(Guid id, UpdateOperationTypeDto dto)
        {
           
                
            try
            {
                var operationType = await _service.UpdateAsync(id,dto);

                if (operationType == null)
                {
                    return NotFound();
                }
                return Ok(operationType);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }

            
        }



        // Inactivate: api/OperationTypes/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<OperationTypeDto>> SoftDelete(Guid id)
        {
            var operationType = await _service.InactivateAsync(new OperationTypeId(id));

            if (operationType == null)
            {
                return NotFound();
            }

            return Ok(operationType);
        }

        // DELETE: api/OperationTypes/5
        [HttpDelete("{id}/hard")]
        public async Task<ActionResult<OperationTypeDto>> HardDelete(Guid id)
        {
            try
            {
                var operationType = await _service.DeleteAsync(new OperationTypeId(id));

                if (operationType == null)
                {
                    return NotFound();
                }

                return Ok(operationType);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }


        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN}")]
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<OperationTypeDto>>> GetAllFiltered(
           
            [FromQuery] string? specialization,
            [FromQuery] bool? status)
        {
           

                var operationTypes = await _service.GetAllFilteredAsync( specialization, status);

                return operationTypes;
           
        }

    }
}