using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staff;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {
        private readonly StaffService _service;

        public StaffController(StaffService service)
        {
            _service = service;
        }

        // GET: api/Staff
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/Staff/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StaffDto>> GetGetById(Guid id)
        {
            var cat = await _service.GetByIdAsync(new StaffID(id));

            if (cat == null)
            {
                return NotFound();
            }

            return cat;
        }

        // POST: api/Staff
        [HttpPost]
        public async Task<ActionResult<StaffDto>> Create(CreatingStaffDto dto)
        {
            var cat = await _service.AddAsync(dto);

            return CreatedAtAction(nameof(GetGetById), new { id = cat.Id }, cat);
        }

        
        // PUT: api/Staff/5
        [HttpPut("{id}")]
        public async Task<ActionResult<StaffDto>> Update(Guid id, StaffDto dto)
        {
            if (id != dto.Id)
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

        /*
        // Inactivate: api/Staff/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<StaffDto>> SoftDelete(Guid id)
        {
            var cat = await _service.InactivateAsync(new StaffID(id));

            if (cat == null)
            {
                return NotFound();
            }

            return Ok(cat);
        }
        */
        
        // DELETE: api/Staff/5
        [HttpDelete("{id}/hard")]
        public async Task<ActionResult<StaffDto>> HardDelete(Guid id)
        {
            try
            {
                var cat = await _service.DeleteAsync(new StaffID(id));

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