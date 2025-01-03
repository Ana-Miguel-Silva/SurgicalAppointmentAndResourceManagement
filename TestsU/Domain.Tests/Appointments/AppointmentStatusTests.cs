using DDDSample1.Domain.Appointments;
using Xunit;

namespace DDDSample1.Tests.Domain
{
    public class AppointmentStatusTests
    {
        [Fact]
        public void AppointmentStatus_ShouldContainValidStatuses()
        {
            var statuses = AppointmentStatus.AppointmentStatuses();

            Assert.Contains("SCHEDULED", statuses);
            Assert.Contains("COMPLETED", statuses);
            Assert.Contains("CANCELED", statuses);
        }

        [Fact]
        public void AppointmentStatus_ShouldReturnTrue_WhenValidStatus()
        {
            bool isValid = AppointmentStatus.IsValid("SCHEDULED");

            Assert.True(isValid);
        }

        [Fact]
        public void AppointmentStatus_ShouldReturnFalse_WhenInvalidStatus()
        {
            bool isValid = AppointmentStatus.IsValid("INVALID_STATUS");

            Assert.False(isValid);
        }
    }
}
