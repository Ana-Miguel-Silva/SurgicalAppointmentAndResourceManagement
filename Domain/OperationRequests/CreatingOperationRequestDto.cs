using DDDSample1.Domain.Patient;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationTypes;


namespace DDDSample1.Domain.OperationRequests;

    public class CreatingOperationRequestDto
    {

        public PatientId PatientId { get; set; }

        public LicenseNumber DoctorId { get; set; }

        public OperationTypeId OperationTypeId { get; set; }

        public DateTime Deadline { get; set; }        

        public string Priority { get; set; }

        public CreatingOperationRequestDto(PatientId patId, LicenseNumber docId,OperationTypeId opTypeId,DateTime deadline, string Priority)
        {
            this.PatientId = patId;
            this.DoctorId = docId;
            this.OperationTypeId = opTypeId;
            this.Deadline = deadline;
            this.Priority = Priority;
        }
    }