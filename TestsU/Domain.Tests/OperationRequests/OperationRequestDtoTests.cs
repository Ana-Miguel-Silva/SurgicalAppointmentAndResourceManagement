using System;
using Xunit;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationTypes;

namespace DDDSample1.Tests.Domain.OperationRequests
{
    public class OperationRequestDtoTests
    {
        [Fact]
        public void OperationRequestDto_WithValidParameters_ThenIsCreatedSuccessfully()
        {
            var id = Guid.NewGuid();
            var patientId = new PatientId(Guid.NewGuid());
            var doctorId = new StaffGuid(Guid.NewGuid());
            var operationTypeId = new OperationTypeId(Guid.NewGuid());
            var deadline = DateTime.Now.AddDays(7);
            var priority = "ELECTIVE";

            var dto = new OperationRequestDto(id, patientId, doctorId, operationTypeId, deadline, priority);

            Assert.NotNull(dto);
            Assert.Equal(id, dto.Id);
            Assert.Equal(patientId, dto.MedicalRecordNumber);
            Assert.Equal(doctorId, dto.DoctorId);
            Assert.Equal(operationTypeId, dto.OperationTypeId);
            Assert.Equal(deadline, dto.Deadline);
            Assert.Equal(priority, dto.Priority);
        }
    }
}
