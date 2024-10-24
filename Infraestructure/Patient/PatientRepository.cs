
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using DDDSample1.Infrastructure.Shared;
using Microsoft.EntityFrameworkCore;

namespace DDDSample1.Infrastructure.Patients
{
    public class PatientRepository : BaseRepository<Patient, PatientId>, IPatientRepository
    {
        private readonly DDDSample1DbContext _context;
    
        public PatientRepository(DDDSample1DbContext context):base(context.Patients)
        {
            _context = context;
        }


        public async Task<List<Patient>> GetByEmailAsync(string email)
        {
            return await _context.Patients
                .Where(u => u.Email.FullEmail.Contains(email))
                .ToListAsync();
        }


    }
}