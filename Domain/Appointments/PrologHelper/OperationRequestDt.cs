using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace DDDSample1.Domain.Appointments.Dto
{
    public class OperationRequestDt
    {
    public string OperationRequestID { get; set; }
    public TimeRangeDto Time { get; set; }
    public List<StaffAssignmentDto> StaffAssignments { get; set; }
    }
}