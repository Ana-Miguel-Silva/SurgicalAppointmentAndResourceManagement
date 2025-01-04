using System;
using System.Collections.Generic;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Shared;
using Xunit;

namespace DDDSample1.Tests.Domain
{
    public class AppointmentDtoTests
    {
        [Fact]
        public void AppointmentDto_ShouldCreateSuccessfully_WhenValidParams()
        {
            var id = Guid.NewGuid();
            var roomId = new SurgeryRoomId(new Guid());
            var opReqId = new OperationRequestId(new Guid());
            var date = new Slot(DateTime.Now, DateTime.Now.AddHours(1));
            var status = "Scheduled";
            var slots = new List<AppointmentSlot>
            {
                new AppointmentSlot(new Slot(DateTime.Now.AddHours(1), DateTime.Now.AddHours(2)), new StaffGuid(new Guid()))
            };

            var appointmentDto = new AppointmentDto(id, roomId, opReqId, date, status, slots);

            Assert.NotNull(appointmentDto);
            Assert.Equal(id, appointmentDto.Id);
            Assert.Equal(roomId, appointmentDto.RoomId);
            Assert.Equal(opReqId, appointmentDto.OperationRequestId);
            Assert.Equal(status, appointmentDto.AppStatus);
        }
    }
}
