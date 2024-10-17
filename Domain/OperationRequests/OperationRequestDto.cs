using DDDSample1.Domain.Categories;

namespace DDDSample1.Domain.OperationRequests
{
    public class OperationRequestDto
    {
        public Guid Id { get; set; }

        public CategoryId PatientId { get;  private set; }

        public CategoryId DoctorId { get;  private set; }

        public CategoryId OperationTypeId { get;  private set; }

        public DateTime Deadline { get;  private set; }        

        public string Priority { get;  private set; }

        public OperationRequestDto(Guid Id, CategoryId patId, CategoryId docId,CategoryId opTypeId,DateTime deadline, string Priority)
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