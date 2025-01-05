using Microsoft.AspNetCore.Mvc;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.RoomTypess;
using DDDSample1.ApplicationService.RoomTypess;
using DDDSample1.ApplicationService.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Security.Claims;
using DDDSample1.Domain.Patients;
using DDDSample1.ApplicationService.Patients;
using Newtonsoft.Json;
using DDDSample1.ApplicationService.Logging;
using DDDSample1.Domain.Users;

namespace DDDSample1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomTypessController : ControllerBase
    {
        private readonly RoomTypesService _service;
        private readonly AuthorizationService _authService;
        private readonly LogService _logService;


        public RoomTypessController(RoomTypesService service, AuthorizationService authService, LogService logService)
        {
            _service = service;
            _authService = authService;
            _logService = logService;

        }

        // GET: api/RoomTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RoomTypesDto>>> GetAll()
        {

            Console.WriteLine("controller entrei");

            return await _service.GetAllAsync();
        }

        // POST: api/RoomTypess
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN}")]
        [HttpPost]
        public async Task<ActionResult<RoomTypesDto>> Create(CreatingRoomTypesDto dto)
        {

            var result = await _service.AddAsync(dto);

            if (result == null)
            {
                return BadRequest("Wasn't possible to create the RoomTypes.");
            }

            return CreatedAtAction(nameof(Create), new { id = result.RoomTypeId }, result);



        }

       
       
        [HttpPatch("update")]  
        public async Task<ActionResult<RoomTypesDto>> Update(RoomTypesDto dto)
        {
           


            var result = await _service.UpdateAsync(dto);

            if (result == null)
            {
                return BadRequest("Wasn't possible to update the RoomTypes.");
            }

            return Ok(result);



        }


          [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = $"{Role.ADMIN}")]
         [HttpGet("{code}")]
        public async Task<ActionResult<RoomTypesDto>> getByCode(string code)
        {

            var result = await _service.GetByCodeAsync(code);

            if (result == null)
            {
                return BadRequest("Wasn't possible to get the RoomTypes.");
            }

            return Ok(result);

        }


       


    }
}