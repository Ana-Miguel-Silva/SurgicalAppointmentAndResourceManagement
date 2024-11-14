namespace DDDSample1.Domain.OperationRequests;

public class UpdateOperationRequestDto
{
    public Guid Id { get; set; }
    public DateTime? Deadline { get; set; }
    public string? Priority { get; set; }
    public UpdateOperationRequestDto(Guid id, DateTime? deadline, string? priority)
    {
        this.Id = id;
        this.Deadline = deadline;
        this.Priority = priority;
    }
}