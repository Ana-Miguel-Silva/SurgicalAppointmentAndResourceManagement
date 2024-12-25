using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Appointments;
using DDDSample1.ApplicationService.Appointments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;
using DDDSample1.ApplicationService.Logging;
using DDDSample1.ApplicationService.Shared;
using DDDSample1.Domain.Users;
using Newtonsoft.Json;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Appointments : ControllerBase
    {
        private readonly AppointmentService _service;
        private readonly AuthorizationService _authService;
        private readonly LogService _logService;



        public Appointments(AppointmentService service, AuthorizationService authService, LogService logService)
        {
            _service = service;
            _authService = authService;
            _logService = logService;
        }

        // GET: api/Appointments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppointmentDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/Appointments/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AppointmentDto>> GetGetById(Guid id)
        {
            var appointment = await _service.GetByIdAsync(new AppointmentId(id));

            if (appointment == null)
            {
                return NotFound();
            }

            return appointment;
        }

        // POST: api/Appointments
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.DOCTOR}")]
        [HttpPost]
        public async Task<ActionResult<AppointmentDto>> Create(CreatingAppointmentDto dto)
        {

            try
            {
                string userEmail = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;
                var appointment = await _service.AddAsync(dto);


                await _logService.LogAsync("Appointment", "Created", appointment.Id, JsonConvert.SerializeObject(dto), userEmail);

                return CreatedAtAction(nameof(GetGetById), new { id = appointment.Id }, appointment);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }

        }

        // POST: api/Appointments/pmodule2
        [HttpPost("pmodule2")]
        public async Task<IActionResult> Pmodule2(ScheduleInputData data)
        {
            try
            {
                var appointment = await _service.ScheduleAppointments(data);

                return Ok(new { message = appointment });
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }


        // PUT: api/Appointments/5
        [HttpPut("{id}")]
        public async Task<ActionResult<AppointmentDto>> Update(Guid id, AppointmentDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var appointment = await _service.UpdateAsync(dto);

                if (appointment == null)
                {
                    return NotFound();
                }
                return Ok(appointment);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // DELETE: api/Appointments/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<AppointmentDto>> HardDelete(Guid id)
        {
            try
            {
                var appointment = await _service.DeleteAsync(new AppointmentId(id));

                if (appointment == null)
                {
                    return NotFound();
                }

                return Ok(appointment);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}