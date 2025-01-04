using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.SurgeryRooms;


namespace DDDSample1.Tests.Domain
{
    public class UpdateAppointmentDtoTests
    {
        [Fact]
        public void UpdateAppointmentDto_ShouldCreateSuccessfully_WhenValidParams()
        {
            var id = Guid.NewGuid().ToString();
            var roomId = new SurgeryRoomId(Guid.NewGuid());
            var date = "2025-01-01T14:00:00";
            var selectedStaff = new List<string> { "staff1", "staff2" };

            var updateDto = new UpdateAppointmentDto(id, roomId.Value, date, selectedStaff);

            Assert.NotNull(updateDto);
            Assert.Equal(id, updateDto.Id.ToString());
            Assert.Equal(roomId.Value, updateDto.RoomId.AsString());
            Assert.Equal(date, updateDto.Start);
            Assert.Equal(selectedStaff, updateDto.SelectedStaff);
        }

    }
}
