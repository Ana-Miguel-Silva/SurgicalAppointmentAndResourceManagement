using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Staff;
using Xunit;

namespace DDDSample1.Domain.Tests
{
    public class CreatingOperationRequestDtoTests
    {
        [Fact]
        public void Constructor_ShouldSetPropertiesCorrectly()
        {
            PatientId expectedPatientId = new PatientId(Guid.NewGuid());
            StaffGuid expectedStaffId = new StaffGuid(Guid.NewGuid()); // Added StaffGuid
            OperationTypeId expectedOperationTypeId = new OperationTypeId(Guid.NewGuid());
            DateTime expectedDeadline = DateTime.UtcNow.AddDays(7);
            string expectedPriority = "ELECTIVE";

            CreatingOperationRequestDto creatingOperationRequestDto = new CreatingOperationRequestDto(
                expectedPatientId,
                expectedStaffId,
                expectedOperationTypeId,
                expectedDeadline,
                expectedPriority
            );

            Assert.Equal(expectedPatientId, creatingOperationRequestDto.MedicalRecordNumber);
            Assert.Equal(expectedOperationTypeId, creatingOperationRequestDto.OperationTypeId);
            Assert.Equal(expectedDeadline, creatingOperationRequestDto.Deadline);
            Assert.Equal(expectedPriority, creatingOperationRequestDto.Priority);
        }

    }
}