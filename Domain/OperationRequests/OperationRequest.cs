using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Categories;
using DDDSample1.Domain.Patient;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationTypes;


namespace DDDSample1.Domain.OperationRequests
{
    public class OperationRequest : Entity<OperationRequestId>, IAggregateRoot
    {

        public PatientId PatientId { get; private set; }

        public LicenseNumber DoctorId { get; private set; }

        public OperationTypeId OperationTypeId { get; private set; }

        public DateTime Deadline { get; private set; }

        public string Priority { get; private set; }

        public bool Active { get; private set; }

        private OperationRequest()
        {
            this.Active = true;
        }

        public OperationRequest(PatientId patId, LicenseNumber docId, OperationTypeId opTypeId, DateTime deadline, string Priority)
        {

            //verificar de operationType dá match com a especialização do doutor
            //verificar se data é valida

            if (patId == null || docId == null || opTypeId == null || deadline == null || Priority == null)
                throw new BusinessRuleValidationException("One of the operation request parameters was not valid");

            this.Id = new OperationRequestId(Guid.NewGuid());
            this.PatientId = patId;
            this.DoctorId = docId;
            this.OperationTypeId = opTypeId;
            this.Deadline = deadline;
            this.Priority = Priority;
            this.Active = true;
        }

        /*

        public void ChangePatientId(CategoryId patId)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("It is not possible to change the category of an inactive operation request.");
            if (catId == null)
                throw new BusinessRuleValidationException("Every operation request requires a patient.");
            this.PatientId = patId;;
        }

        public void ChangeDoctorId(CategoryId docId)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("It is not possible to change the doctor of an inactive operation request.");
            if (docId == null)
                throw new BusinessRuleValidationException("Every operation request requires a valid doctor.");
            
            this.DoctorId = docId;
        }

        public void ChangeOperationTypeId(CategoryId opTypeId)
        {
            if (!this.Active)
                throw new BusinessRuleValidationException("It is not possible to change the operation type of an inactive operation request.");
            if (opTypeId == null)
                throw new BusinessRuleValidationException("Every operation request requires a valid operation type.");
            
            this.OperationTypeId = opTypeId;
        }

        */

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