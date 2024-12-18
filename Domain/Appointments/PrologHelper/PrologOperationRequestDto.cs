namespace DDDSample1.Domain.Appointments
{
    public class PrologOperationRequestDto
    {
    public string OperationRequestID { get; set; }
    public PrologSlotDto Time { get; set; }
    public List<PrologAssignedStaffDto> StaffAssignments { get; set; }
    }
}