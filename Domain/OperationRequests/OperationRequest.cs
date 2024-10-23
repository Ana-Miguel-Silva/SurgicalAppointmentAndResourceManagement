using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Categories;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationTypes;


namespace DDDSample1.Domain.OperationRequests
{
    public class OperationRequest : Entity<OperationRequestId>, IAggregateRoot
    {

        public PatientId MedicalRecordNumber { get; private set; }

        public StaffId DoctorId { get; private set; }

        public OperationTypeId OperationTypeId { get; private set; }

        public DateTime Deadline { get; private set; }

        public string Priority { get; private set; }

        public bool Active { get; private set; }

        private OperationRequest()
        {
            this.Active = true;
        }

        public OperationRequest(PatientId patId, StaffId docId, OperationTypeId opTypeId, DateTime deadline, string priority)
        {

            if (patId == null || docId == null || opTypeId == null || deadline == null || priority == null)
                throw new BusinessRuleValidationException("One of the operation request parameters was not valid");

            this.Id = new OperationRequestId(Guid.NewGuid());
            this.MedicalRecordNumber = patId;
            this.DoctorId = docId;
            this.OperationTypeId = opTypeId;
            this.Deadline = deadline;
            this.Priority = priority;
            this.Active = true;
        }

        public void ChangeDeadline(DateTime newDeadline)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("Cannot change the deadline of an inactive operation request.");

            if (newDeadline == null)
                throw new BusinessRuleValidationException("The new deadline must be valid.");

            this.Deadline = newDeadline;
        }

        public void ChangePriority(String Priority)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("Cannot change the deadline of an inactive operation request.");

            if (Priority == null)
                throw new BusinessRuleValidationException("The new Priority must be valid.");

            this.Priority = Priority;
        }
        public void MarkAsInative()
        {
            this.Active = false;
        }
    }
}