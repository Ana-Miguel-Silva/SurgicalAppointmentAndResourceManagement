using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace DDDSample1.Domain.Appointments.Dto
{
    public class TimeRangeDto
    {
    public int Start { get; set; }
    public int End { get; set; }
    }
}