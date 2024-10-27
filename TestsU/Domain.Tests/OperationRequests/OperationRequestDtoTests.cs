using System;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationTypes;
using Xunit;

namespace DDDSample1.Domain.Tests
{
    public class OperationRequestDtoTests
    {
        [Fact]
        public void Constructor_ShouldSetPropertiesCorrectly()
        {
            Guid expectedId = Guid.NewGuid();
            PatientId expectedPatientId = new PatientId(Guid.NewGuid());
            StaffGuid expectedDoctorId = new StaffGuid(Guid.NewGuid());
            OperationTypeId expectedOperationTypeId = new OperationTypeId(Guid.NewGuid());
            DateTime expectedDeadline = DateTime.UtcNow.AddDays(7);
            string expectedPriority = "ELECTIVE";

            OperationRequestDto operationRequestDto = new OperationRequestDto(
                expectedId,
                expectedPatientId,
                expectedDoctorId,
                expectedOperationTypeId,
                expectedDeadline,
                expectedPriority
            );

            Assert.Equal(expectedId, operationRequestDto.Id);
            Assert.Equal(expectedPatientId, operationRequestDto.MedicalRecordNumber);
            Assert.Equal(expectedDoctorId, operationRequestDto.DoctorId);
            Assert.Equal(expectedOperationTypeId, operationRequestDto.OperationTypeId);
            Assert.Equal(expectedDeadline, operationRequestDto.Deadline);
            Assert.Equal(expectedPriority, operationRequestDto.Priority);
        }
        
        [Fact]
        public void Constructor_ShouldThrowArgumentNullException_WhenPatientIdIsNull()
        {
            Guid expectedId = Guid.NewGuid();
            StaffGuid expectedDoctorId = new StaffGuid(Guid.NewGuid());
            OperationTypeId expectedOperationTypeId = new OperationTypeId(Guid.NewGuid());
            DateTime expectedDeadline = DateTime.UtcNow.AddDays(7);
            string expectedPriority = "ELECTIVE";

            Assert.Throws<ArgumentNullException>(() => new OperationRequestDto(
                expectedId,
                null,
                expectedDoctorId,
                expectedOperationTypeId,
                expectedDeadline,
                expectedPriority
            ));
        }

    }
}