using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Categories;
using DDDSample1.Domain.OperationRequests;


namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OperationRequests : ControllerBase
    {
        private readonly OperationRequestService _service;

        public OperationRequests(OperationRequestService service)
        {
            _service = service;
        }

        // GET: api/OperationRequests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OperationRequestDto>>> GetAll()
        {
            return await _service.GetAllAsync();
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
            try
            {
                var operationRequest = await _service.AddAsync(dto);

                return CreatedAtAction(nameof(GetGetById), new { id = operationRequest.Id }, operationRequest);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }

        
        // PUT: api/OperationRequests/5
        [HttpPut("{id}")]
        public async Task<ActionResult<OperationRequestDto>> Update(Guid id, OperationRequestDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var operationRequest = await _service.UpdateAsync(dto);
                
                if (operationRequest == null)
                {
                    return NotFound();
                }
                return Ok(operationRequest);
            }
            catch(BusinessRuleValidationException ex)
            {
                return BadRequest(new {Message = ex.Message});
            }
        }

        // Inactivate: api/OperationRequests/5
        [HttpDelete("{id}")]
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
        [HttpDelete("{id}/hard")]
        public async Task<ActionResult<OperationRequestDto>> HardDelete(Guid id)
        {
            try
            {
                var operationRequest = await _service.DeleteAsync(new OperationRequestId(id));

                if (operationRequest == null)
                {
                    return NotFound();
                }

                return Ok(operationRequest);
            }
            catch(BusinessRuleValidationException ex)
            {
               return BadRequest(new {Message = ex.Message});
            }
        }
    }
}