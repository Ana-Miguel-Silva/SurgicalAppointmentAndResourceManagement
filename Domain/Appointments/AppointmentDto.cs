using System;
using DDDSample1.Domain.Categories;
using DDDSample1.Domain.OperationRequests;


namespace DDDSample1.Domain.Appointments
{
    public class AppointmentDto
    {
        public Guid Id { get; set; }

        public CategoryId RoomId { get; private set; }

        public OperationRequestId OperationRequestId { get; private set; }

        public DateTime Date { get; private set; }

        public string AppStatus { get; private set; }

        public AppointmentDto(Guid Id, CategoryId roomId, OperationRequestId opReqId, DateTime date, string status)
        {
            this.Id = Id;
            this.RoomId = roomId;
            this.OperationRequestId = opReqId;
            this.Date = date;
            this.AppStatus = status;
        }

    }
}