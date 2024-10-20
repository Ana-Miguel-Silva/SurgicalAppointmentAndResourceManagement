using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staff;
using Microsoft.AspNetCore.Authorization;
using DDSample1.Domain.Shared;
using DDDSample1.Domain.Users;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {

        private readonly string RoleAdmin = "Admin";
        private readonly StaffService _service;

        private readonly AuthorizationService _authService;

        public StaffController(StaffService service, AuthorizationService authService)
        {
            _service = service;
            _authService = authService;
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
            var cat = await _service.GetByIdAsync(new StaffId(id));

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
            var authorizationHeader = Request.Headers["Authorization"].ToString();
            User user;                      
            try
            {
                user = await _authService.ValidateTokenAsync(authorizationHeader);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(ex.Message);
            }

            bool isAuthoraze = await _authService.validateUserRole(user, RoleAdmin);

            if(isAuthoraze){
                var cat = await _service.AddAsync(dto);

                return CreatedAtAction(nameof(GetGetById), new { id = cat.Id }, cat);
            }
             return Forbid(); 
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
            var cat = await _service.InactivateAsync(new StaffId(id));

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
                var cat = await _service.DeleteAsync(new StaffId(id));

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