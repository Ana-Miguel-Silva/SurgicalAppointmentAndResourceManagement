using System;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Categories;

namespace DDDSample1.Domain.OperationRequests
{
    public class OperationRequest : Entity<OperationRequestId>, IAggregateRoot
    {

        public CategoryId PatientId { get;  private set; }

        public CategoryId DoctorId { get;  private set; }

        public CategoryId OperationTypeId { get;  private set; }

        public DateTime Deadline { get;  private set; }        

        public string Priorirty { get;  private set; } //String, Class, Enum, ... ?

        public bool Active{ get;  private set; }

        private OperationRequest()
        {
            this.Active = true;
        }

        public OperationRequest(CategoryId patId, CategoryId docId,CategoryId opTypeId,DateTime deadline, string priorirty)
        {

            //verificar de operationType dá match com a especialização do doutor
            //verificar se data é valida

            if (patId == null || docId == null || opTypeId == null || InPast(deadline))
                throw new BusinessRuleValidationException("One of the operation request parameters was not valid");

            this.Id = new OperationRequestId(Guid.NewGuid());
            this.PatientId = patId;
            this.DoctorId = docId;
            this.OperationTypeId = opTypeId;
            this.Deadline = deadline;
            this.Priorirty = priorirty;
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

            if (InPast(newDeadline))
                throw new BusinessRuleValidationException("The new deadline must be in the future.");

            this.Deadline = newDeadline;
        }

        public Boolean InPast(DateTime date){
            return date <= DateTime.Now;
        }

        public void MarkAsInative()
        {
            this.Active = false;
        }
    }
}