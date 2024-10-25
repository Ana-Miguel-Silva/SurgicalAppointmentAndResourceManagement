using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patients
{
    public interface IPatientRepository : IRepository<Patient, PatientId>
    {
        Task<List<Patient>> GetByNameAsync(string name);

        Task<Patient> GetByEmailAsync(string email);


        //Task<Patient> GetByIdAsync(PatientId id);
    }
}