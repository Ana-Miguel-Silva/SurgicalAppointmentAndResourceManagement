using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Users;
using DDDSample1.ApplicationService.Staff;
using DDDSample1.ApplicationService.Shared;
using DDDSample1.ApplicationService.Logging;
using Newtonsoft.Json;
using DDDSample1.ApplicationService.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {

        private readonly StaffService _service;
        private readonly LogService _logService;

        private readonly AuthorizationService _authService;

        private readonly UserService _userService;

        public StaffController(StaffService service, AuthorizationService authService, LogService logService, UserService userService)
        {
            _service = service;
            _authService = authService;
            _logService = logService;
            _userService = userService;

        }

        // GET: api/Staff?name=x&id=1&license=b&phone=999999999
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN}, {Role.DOCTOR}")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StaffDto>>> GetAll([FromQuery] GetStaffQueryObject request)
        {
            //var userId = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            //var user = await _userService.GetByIdAsync(new UserId(userId));           
        
            return await _service.GetAllFilteredAsync(request.id, request.name, request.license, request.phone, request.specialization, request.role, request.active);
            
        }


        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN}, {Role.DOCTOR}")]
        [HttpGet("email/{email}")]
        public async Task<ActionResult<StaffDto>> GetByEmail(string email)
        { 
        
            var user = await _service.GetStaffByEmailAsync(email);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
            
        }

        public class GetStaffQueryObject
        {
            public string? id { get; set; }
            public string? name { get; set; }
            public string? license { get; set; }
            public string? phone { get; set; }
            public string? specialization { get; set; }
            public string? role { get; set; }
            public string? active {get; set;}
        }

        // GET: api/Staff/5
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN}")]
        [HttpGet("{id}")]
        public async Task<ActionResult<StaffDto>> GetGetById(string id)
        {

            var cat = await _service.GetByStaffIDAsync(id);

            if (cat == null)
            {
                return NotFound();
            }

            return cat;
            
        }

        // POST: api/Staff
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN}")]
        [HttpPost]

        public async Task<ActionResult<StaffDto>> Create(CreatingStaffDto dto)
        {
            try
            {
                var cat = await _service.AddAsync(dto);

                return CreatedAtAction(nameof(GetGetById), new { id = cat.Id }, cat);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
           
        }
        // PUT: api/Staff/{id}/Slots
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN}")]
        [HttpPut("{id}/SlotsAdd")]
        public async Task<ActionResult<StaffDto>> AddSlots(string id, SlotDTO dto)
        {
            var catOld = await _service.GetByStaffIDAsync(id);

            Console.Write(catOld.Name);
            if (id != catOld.StaffId)
            {
                return BadRequest();
            }

            try
            {
                //string userEmail =HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;
               

                var cat = await _service.AddSlots(id, dto);

                //await _logService.LogAsync("OperationRequest", "Deleted", cat.Id, "old" + JsonConvert.SerializeObject(catOld) + "new" + JsonConvert.SerializeObject(dto), userEmail);

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
        // DELETE: api/Staff/{id}/Slots
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN}")]
        [HttpPut("{id}/SlotsRemove")]
        public async Task<ActionResult<StaffDto>> RemoveSlots(string id, SlotDTO dto)
        {
            var catOld = await _service.GetByStaffIDAsync(id);

            Console.Write(catOld.Name);
            if (id != catOld.StaffId)
            {
                return BadRequest();
            }

            try
            {
                //string userEmail =HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;
               

                var cat = await _service.RemoveSlots(id, dto);

                //await _logService.LogAsync("OperationRequest", "Deleted", cat.Id, "old" + JsonConvert.SerializeObject(catOld) + "new" + JsonConvert.SerializeObject(dto), userEmail);

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

        // PUT: api/Staff/5
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN}")]
        [HttpPut("{id}")]
        public async Task<ActionResult<StaffDto>> Update(string id, UpdateStaffDto dto)
        {
            var catOld = await _service.GetByStaffIDAsync(id);

            Console.Write(catOld.Name);
            if (id != catOld.StaffId)
            {
                return BadRequest();
            }

            try
            {
                string userEmail =HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;
               

                var cat = await _service.UpdateAsync(id, dto);

                await _logService.LogAsync("OperationRequest", "Deleted", cat.Id, "old" + JsonConvert.SerializeObject(catOld) + "new" + JsonConvert.SerializeObject(dto), userEmail);

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

        
        // Inactivate: api/Staff/5
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN}")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<StaffDto>> SoftDelete(string id)
        {
            var cat = await _service.InactivateAsync(id);

            if (cat == null)
            {
                return NotFound();
            }

            return Ok(cat);
        }
        

        // DELETE: api/Staff/5
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN}")]
        [HttpDelete("{id}/hard")]
        public async Task<ActionResult<StaffDto>> HardDelete(string id)
        {
            try
            {
                string userEmail =HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;

                var cat = await _service.DeleteAsync(id);

                await _logService.LogAsync("OperationRequest", "Deleted", cat.Id, JsonConvert.SerializeObject(cat), userEmail);

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