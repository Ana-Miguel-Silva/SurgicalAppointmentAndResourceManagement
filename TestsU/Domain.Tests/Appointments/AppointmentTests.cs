using System;
using System.Collections.Generic;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Shared;
using Xunit;

namespace DDDSample1.Tests.Domain
{
    public class AppointmentTests
    {
        [Fact]
        public void Appointment_ShouldThrowException_WhenInvalidParams()
        {
            SurgeryRoomId roomId = null;
            OperationRequestId opReqId = null;
            Slot date = null;
            string status = null;
            List<AppointmentSlot> slots = new List<AppointmentSlot>();

            Assert.Throws<BusinessRuleValidationException>(() =>
                new Appointment(roomId, opReqId, date, status, slots)
            );
        }

        [Fact]
        public void Appointment_ShouldCreateSuccessfully_WhenValidParams()
        {
            var roomId = new SurgeryRoomId(new Guid());
            var opReqId = new OperationRequestId(new Guid());
            var date = new Slot(DateTime.Now, DateTime.Now.AddHours(1));
            var status = "Scheduled";
            var slots = new List<AppointmentSlot>
            {
                new AppointmentSlot(new Slot(DateTime.Now.AddHours(1), DateTime.Now.AddHours(2)), new StaffGuid(new Guid()))
            };

            var appointment = new Appointment(roomId, opReqId, date, status, slots);

            Assert.NotNull(appointment);
            Assert.Equal(roomId, appointment.RoomId);
            Assert.Equal(opReqId, appointment.OperationRequestId);
            Assert.Equal(status, appointment.AppStatus);
        }
    }
}
