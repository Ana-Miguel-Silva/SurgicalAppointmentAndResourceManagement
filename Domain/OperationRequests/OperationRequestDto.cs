using System.ComponentModel;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Patient;

namespace DDDSample1.Domain.OperationRequests
{
    public class OperationRequestDto
    {
        public Guid Id { get; set; }

        public PatientId PatientId { get; set; }

        public StaffId DoctorId { get; set; }

        public OperationTypeId OperationTypeId { get; set; }

        public DateTime Deadline { get; set; }

        public string Priority { get; set; }

        public OperationRequestDto(Guid Id, PatientId patId, StaffId docId, OperationTypeId opTypeId, DateTime deadline, string Priority)
        {
            this.Id = Id;
            this.PatientId = patId;
            this.DoctorId = docId;
            this.OperationTypeId = opTypeId;
            this.Deadline = deadline;
            this.Priority = Priority;
        }
    }
}