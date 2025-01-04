using System;
using Xunit;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.OperationTypes;

namespace DDDSample1.Tests.Domain.OperationRequests
{
    public class CreatingOperationRequestDtoTests
    {
        [Fact]
        public void CreatingOperationRequestDto_WithValidParameters_ThenIsCreatedSuccessfully()
        {
            var patientId = new PatientId(Guid.NewGuid());
            var operationTypeId = new OperationTypeId(Guid.NewGuid());
            var deadline = DateTime.Now.AddDays(7);
            var priority = "URGENT";

            var dto = new CreatingOperationRequestDto(patientId, null, operationTypeId, deadline, priority);

            Assert.NotNull(dto);
            Assert.Equal(patientId, dto.MedicalRecordNumber);
            Assert.Equal(operationTypeId, dto.OperationTypeId);
            Assert.Equal(deadline, dto.Deadline);
            Assert.Equal(priority, dto.Priority);
        }
    }
}
