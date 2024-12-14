using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace DDDSample1.Domain.Appointments.Dto
{
    public class StaffAssignmentDto
    {
    public string StaffID { get; set; }
    public TimeRangeDto Time { get; set; }
    }
}