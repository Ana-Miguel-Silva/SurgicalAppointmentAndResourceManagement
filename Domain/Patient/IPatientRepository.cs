using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Patient
{
    public interface IPatientRepository: IRepository<Patient,PatientId>
    {
    }
}