using DDDSample1.Domain.Categories;

namespace DDDSample1.Domain.OperationRequests;

    public class CreatingOperationRequestDto
    {

        public CategoryId PatientId { get; set; }

        public CategoryId DoctorId { get; set; }

        public CategoryId OperationTypeId { get; set; }

        public DateTime Deadline { get; set; }        

        public string Priority { get; set; }

        public CreatingOperationRequestDto(CategoryId patId, CategoryId docId,CategoryId opTypeId,DateTime deadline, string Priority)
        {
            this.PatientId = patId;
            this.DoctorId = docId;
            this.OperationTypeId = opTypeId;
            this.Deadline = deadline;
            this.Priority = Priority;
        }
    }