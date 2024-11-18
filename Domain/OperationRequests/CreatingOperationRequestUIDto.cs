using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Shared;


namespace DDDSample1.Domain.OperationRequests;

    public class CreatingOperationRequestUIDto
    {

        public string PatientEmail { get; set; }

        public string OperationTypeName { get; set; }

        public DateTime Deadline { get; set; }        

        public string Priority { get; set; }


    public CreatingOperationRequestUIDto(string patEmail, string operationTypeName,DateTime deadline, string priority)
        {
            this.PatientEmail = patEmail;
            this.OperationTypeName = operationTypeName;
            this.Deadline = deadline;
            this.Priority = priority;
        }
    }