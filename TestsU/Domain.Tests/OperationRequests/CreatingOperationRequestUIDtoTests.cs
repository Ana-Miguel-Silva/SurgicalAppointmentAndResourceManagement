using System;
using Xunit;
using DDDSample1.Domain.OperationRequests;

namespace DDDSample1.Tests.Domain.OperationRequests
{
    public class CreatingOperationRequestUIDtoTests
    {
        [Fact]
        public void CreatingOperationRequestUIDto_WithValidParameters_ThenIsCreatedSuccessfully()
        {
            var patientEmail = "patient@example.com";
            var operationTypeName = "Surgery";
            var deadline = DateTime.Now.AddDays(7);
            var priority = "URGENT";

            var uiDto = new CreatingOperationRequestUIDto(patientEmail, operationTypeName, deadline, priority);

            Assert.NotNull(uiDto);
            Assert.Equal(patientEmail, uiDto.PatientEmail);
            Assert.Equal(operationTypeName, uiDto.OperationTypeName);
            Assert.Equal(deadline, uiDto.Deadline);
            Assert.Equal(priority, uiDto.Priority);
        }
    }
}
