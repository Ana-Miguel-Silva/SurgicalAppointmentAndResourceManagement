using System;
using DDDSample1.Domain.Categories;

namespace DDDSample1.Domain.OperationRequests;

    public class CreatingAppointmentDto
    {
        public CategoryId RoomId { get; private set; }

        public OperationRequestId OperationRequestId { get; private set; }

        public DateTime Date { get; private set; }

        public CreatingAppointmentDto(CategoryId roomId, OperationRequestId opReqId, DateTime date)
        {
            this.RoomId = roomId;
            this.OperationRequestId = opReqId;
            this.Date = date;
        }

    }