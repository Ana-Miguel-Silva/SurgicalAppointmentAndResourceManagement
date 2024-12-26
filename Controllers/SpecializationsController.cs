using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Users;
using Newtonsoft.Json;
using DDDSample1.ApplicationService.Specializations;
using DDDSample1.ApplicationService.Logging;
using DDDSample1.ApplicationService.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;


namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Specializations : ControllerBase
    {
        private readonly SpecializationService _service;

        private readonly AuthorizationService _authService;

        private readonly LogService _logService;

        public Specializations(SpecializationService service, AuthorizationService authService, LogService logService)
        {
            _authService = authService;
            _service = service;
            _logService = logService;
        }

        // GET: api/Specializations
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN}")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SpecializationUIDto>>> GetAll()
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

        // GET: api/Specializations/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SpecializationDto>> GetGetById(Guid id)
        {
            var specialization = await _service.GetByIdAsync(new SpecializationId(id));

            if (specialization == null)
            {
                return NotFound();
            }

            return specialization;
        }
        // GET: api/Specializations/5
        [HttpGet("name/{id}")]
        public async Task<ActionResult<SpecializationUIDto>> GeByName(String id)
        {
            var specialization = await _service.GetByNameAsync(id);

            if (specialization == null)
            {
                return NotFound();
            }

            return specialization;
        }

        // POST: api/Specializations
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN}")]
        [HttpPost]
        public async Task<ActionResult<SpecializationDto>> Create(CreatingSpecializationDto dto)
        {

            try
            {
                string userEmail = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;
                var specialization = await _service.AddAsync(dto);


                await _logService.LogAsync("Specialization", "Created", specialization.Id, JsonConvert.SerializeObject(dto), userEmail);

                return CreatedAtAction(nameof(GetGetById), new { id = specialization.Id }, specialization);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }

        }


        // GET: api/Specializations/search
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.DOCTOR}")]
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<SpecializationUIDto>>> GetAllFiltered(
            [FromQuery] string? specialization)
        {
            var specializations = await _service.GetAllFilteredAsync(specialization);

            return specializations;

        }



        // PATCH: api/Specializations/5
        /*[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN}")]
        [HttpPatch("{id}")]
        public async Task<ActionResult<SpecializationDto>> Update(Guid id, SpecializationDto dto)
        {

            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                string userEmail = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;

                var specializationOld = await _service.GetByIdAsync(new SpecializationId(id));

                var specialization = await _service.UpdateAsync(dto, userEmail);



                await _logService.LogAsync("Specialization", "Updated", specialization.Id, "old" + JsonConvert.SerializeObject(specializationOld) + "new" + JsonConvert.SerializeObject(dto), userEmail);

                if (specialization == null)
                {
                    return NotFound();
                }
                return Ok(specialization);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }

        }*/

        // DELETE: api/Specializations/5
        /*[Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN}")]
        [HttpDelete("{id}")]
        public async Task<ActionResult<SpecializationDto>> HardDelete(Guid id)
        {
            try
            {
                string userEmail = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;

                var specialization = await _service.DeleteAsync(new SpecializationId(id));

                await _logService.LogAsync("Specialization", "Deleted", specialization.Id, JsonConvert.SerializeObject(specialization), userEmail);

                if (specialization == null)
                {
                    return NotFound();
                }

                return Ok(specialization);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }

        }*/

    }
}