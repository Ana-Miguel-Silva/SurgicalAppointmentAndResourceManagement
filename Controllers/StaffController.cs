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

        // GET: api/Staff?name=x&id=1&license=b&phone=999999999
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetAll([FromQuery] GetStaffQueryObject request)
        {
            return await _service.GetAllFilteredAsync(request.id, request.name, request.license, request.phone, request.specialization, request.role);
        }

        public class GetStaffQueryObject
        {
            public string? id { get; set; }
            public string? name { get; set; }
            public string? license { get; set; }
            public string? phone { get; set; }
            public string? specialization { get; set; }
            public string? role { get; set; }
        }

        // GET: api/Staff/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StaffDto>> GetGetById(string id)
        {
            var cat = await _service.GetByIdAsync(new StaffGuid(id));

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

            bool isAuthoraze = await _authService.ValidateUserRole(user, new List<string> {Role.ADMIN});

            if (isAuthoraze)
            {
                var cat = await _service.AddAsync(dto);

                return CreatedAtAction(nameof(GetGetById), new { id = cat.Id }, cat);
            }
            return Forbid();
        }


        // PUT: api/Staff/5
        [HttpPut("{id}")]
        public async Task<ActionResult<StaffDto>> Update(string id, StaffDto dto)
        {
            if (id != dto.StaffId)
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
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        /*
        // Inactivate: api/Staff/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<StaffDto>> SoftDelete(Guid id)
        {
            var cat = await _service.InactivateAsync(new StaffGuid(id));

            if (cat == null)
            {
                return NotFound();
            }

            return Ok(cat);
        }
        */

        // DELETE: api/Staff/5
        [HttpDelete("{id}/hard")]
        public async Task<ActionResult<StaffDto>> HardDelete(string id)
        {
            try
            {
                var cat = await _service.DeleteAsync(new StaffGuid(id));

                if (cat == null)
                {
                    return NotFound();
                }

                return Ok(cat);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}