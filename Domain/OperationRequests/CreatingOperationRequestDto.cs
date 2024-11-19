using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationTypes;

namespace DDDSample1.Domain.OperationRequests;

    public class CreatingOperationRequestDto
    {

        public PatientId MedicalRecordNumber { get; set; }

        public OperationTypeId OperationTypeId { get; set; }

        public DateTime Deadline { get; set; }        

        public string Priority { get; set; }


    public CreatingOperationRequestDto(PatientId patId, StaffGuid docId,OperationTypeId opTypeId,DateTime deadline, string priority)
        {
            this.MedicalRecordNumber = patId;
            this.OperationTypeId = opTypeId;
            this.Deadline = deadline;
            this.Priority = priority;
        }
    }