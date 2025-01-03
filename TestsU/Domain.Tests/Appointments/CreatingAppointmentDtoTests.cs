using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Domain.Staff;

namespace DDDSample1.Tests.Domain
{
    public class CreatingAppointmentDtoTests
    {
        [Fact]
        public void CreatingAppointmentDto_ShouldCreateSuccessfully_WhenValidParams()
        {
            var roomId = new SurgeryRoomId(new Guid());
            var operationRequestId = new OperationRequestId(new Guid());
            var date = "2025-01-01T10:00:00";
            var selectedStaff = new List<string> { new StaffGuid(new Guid()).Value, new StaffGuid(new Guid()).Value };

            var dto = new CreatingAppointmentDto(roomId.Value, operationRequestId.Value, date, selectedStaff);

            Assert.NotNull(dto);
            Assert.Equal(roomId.Value, dto.RoomId.AsString());
            Assert.Equal(operationRequestId.Value, dto.OperationRequestId.AsString());
            Assert.Equal(date, dto.Start);
            Assert.Equal(selectedStaff, dto.SelectedStaff);
        }
    }
}
