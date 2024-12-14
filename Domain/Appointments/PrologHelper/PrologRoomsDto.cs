using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace DDDSample1.Domain.Appointments.Dto
{
    public class PrologRoomsDto
    {
    public string RoomID { get; set; }
    public List<OperationRequestDt> OperationRequests { get; set; }
    }
}