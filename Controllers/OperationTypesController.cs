using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Users;


namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationTypes : ControllerBase
    {
        private readonly OperationTypeService _service;
        private readonly AuthorizationService _authService;


        public OperationTypes(OperationTypeService service,AuthorizationService authService)
        {
            _authService = authService;
            _service = service;
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
        [HttpPost]
        public async Task<ActionResult<OperationTypeDto>> Create(CreatingOperationTypeDto dto)
        {
            try
            {
                var operationType = await _service.AddAsync(dto);

                return CreatedAtAction(nameof(GetGetById), new { id = operationType.Id }, operationType);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }

        
        // PUT: api/OperationTypes/5
        [HttpPut("{id}")]
        public async Task<ActionResult<OperationTypeDto>> Update(Guid id, OperationTypeDto dto)
        {
            if(_authService.ValidateUserRole(Request.Headers["Authorization"].ToString(), new List<string> {Role.ADMIN}).Result){

                try
                {
                    if (id != dto.Id)
                    {
                        return BadRequest();
                    }

                    try
                    {
                        var operationType = await _service.UpdateAsync(dto);
                        
                        if (operationType == null)
                        {
                            return NotFound();
                        }
                        return Ok(operationType);
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
            catch(BusinessRuleValidationException ex)
            {
               return BadRequest(new {Message = ex.Message});
            }
        }
    }
}