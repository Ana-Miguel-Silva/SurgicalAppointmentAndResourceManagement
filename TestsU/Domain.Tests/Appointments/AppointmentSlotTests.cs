using System;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staff;
using Xunit;

namespace DDDSample1.Tests.Domain
{
    public class AppointmentSlotTests
    {
        [Fact]
        public void AppointmentSlot_ShouldCreateSuccessfully_WhenValidParams()
        {
            var staffGuid = new StaffGuid(new Guid());
            var time = new Slot(DateTime.Now, DateTime.Now.AddHours(1));

            var appointmentSlot = new AppointmentSlot(time, staffGuid);

            Assert.NotNull(appointmentSlot);
            Assert.Equal(time, appointmentSlot.AppointmentTime);
            Assert.Equal(staffGuid, appointmentSlot.Staff);
        }

    }
}
