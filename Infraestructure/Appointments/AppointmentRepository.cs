using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.Appointments
{
    public class AppointmentRepository : BaseRepository<Appointment, AppointmentId>,IAppointmentRepository
    {
        private readonly DDDSample1DbContext _context;
        public AppointmentRepository(DDDSample1DbContext context) : base(context.Appointments)
        {
            _context = context;
        }

        public async Task<List<Appointment>> GetByRoomAsync(string roomId)
        {
            var appointments = await _context.Appointments.ToListAsync();

            return appointments.Where(a => a.RoomId.Value.Equals(roomId)).ToList();
        }

    }
}