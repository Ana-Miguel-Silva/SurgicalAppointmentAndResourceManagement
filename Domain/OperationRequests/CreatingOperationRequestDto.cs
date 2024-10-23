using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Shared;


namespace DDDSample1.Domain.OperationRequests;

    public class CreatingOperationRequestDto
    {

        public MedicalRecordNumber MedicalRecordNumber { get; set; }

        public StaffId DoctorId { get; set; }

        public OperationTypeId OperationTypeId { get; set; }

        public DateTime Deadline { get; set; }        

        public string Priority { get; set; }


    public CreatingOperationRequestDto(MedicalRecordNumber patId, StaffId docId,OperationTypeId opTypeId,DateTime deadline, string Priority)
        {
            this.MedicalRecordNumber = patId;
            this.DoctorId = docId;
            this.OperationTypeId = opTypeId;
            this.Deadline = deadline;
            this.Priority = Priority;
        }
    }