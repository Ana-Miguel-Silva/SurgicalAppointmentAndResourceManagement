using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Appointments;
using DDDSample1.ApplicationService.Appointments;
using System.Net.Http;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Appointments : ControllerBase
    {
        private readonly AppointmentService _service;

        public Appointments(AppointmentService service)
        {
            _service = service;
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
        [HttpPost("pmodule")]
        public async Task<ActionResult<string>> Create()
        {
            try
            {
                var appointment = await _service.ScheduleAppointments();

                return (appointment);
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