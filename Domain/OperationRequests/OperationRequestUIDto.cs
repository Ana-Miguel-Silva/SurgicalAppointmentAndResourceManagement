using System.ComponentModel;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.OperationRequests
{
    public class OperationRequestUIDto
    {
        public Guid Id { get; set; }

        public String EmailPatient { get; set; }

        public String EmailDoctor { get; set; }

        public String OperationTypeName { get; set; }

        public DateTime Deadline { get; set; }        

        public string Priority { get; set; }

        public OperationRequestUIDto(Guid id, String patEmail, String docEmail, String opTypeName, DateTime deadline, string priority)
        {
            this.Id = id;
            this.EmailPatient = patEmail;
            this.EmailDoctor = docEmail;
            this.OperationTypeName = opTypeName;
            this.Deadline = deadline;
            this.Priority = priority;
        }

    }
}