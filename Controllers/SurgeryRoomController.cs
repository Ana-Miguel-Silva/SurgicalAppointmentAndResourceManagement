using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.ApplicationService.SurgeryRooms;


namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SurgeryRooms : ControllerBase
    {
        private readonly SurgeryRoomService _service;

        public SurgeryRooms(SurgeryRoomService service)
        {
            _service = service;
        }

        // GET: api/SurgeryRooms
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SurgeryRoomDto>>> GetAll()
        {
            return await _service.GetAllAsync();
        }

        // GET: api/SurgeryRooms/UI
        [HttpGet("UI")]
        public async Task<ActionResult<IEnumerable<SurgeryRoomUIDto>>> GetAllUI()
        {
            return await _service.GetAllUIAsync();
        }

        // GET: api/SurgeryRooms/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SurgeryRoomDto>> GetGetById(Guid id)
        {
            var surgeryRoom = await _service.GetByIdAsync(new SurgeryRoomId(id));

            if (surgeryRoom == null)
            {
                return NotFound();
            }

            return surgeryRoom;
        }

        // POST: api/SurgeryRooms
        [HttpPost]
        public async Task<ActionResult<SurgeryRoomDto>> Create(CreatingSurgeryRoomDto dto)
        {
            try
            {
                var surgeryRoom = await _service.AddAsync(dto);

                return CreatedAtAction(nameof(GetGetById), new { id = surgeryRoom.Id }, surgeryRoom);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }


        // PUT: api/SurgeryRooms/5
        [HttpPut("{id}")]
        public async Task<ActionResult<SurgeryRoomDto>> Update(Guid id, SurgeryRoomDto dto)
        {
            if (id != dto.Id)
            {
                return BadRequest();
            }

            try
            {
                var surgeryRoom = await _service.UpdateAsync(dto);

                if (surgeryRoom == null)
                {
                    return NotFound();
                }
                return Ok(surgeryRoom);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        // DELETE: api/SurgeryRooms/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<SurgeryRoomDto>> HardDelete(Guid id)
        {
            try
            {
                var surgeryRoom = await _service.DeleteAsync(new SurgeryRoomId(id));

                if (surgeryRoom == null)
                {
                    return NotFound();
                }

                return Ok(surgeryRoom);
            }
            catch (BusinessRuleValidationException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}