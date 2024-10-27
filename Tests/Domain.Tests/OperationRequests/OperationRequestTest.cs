using System;
using Moq;
using Xunit;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.OperationRequests
{
    public class OperationRequestTests
    {
        [Fact]
        public void WhenInstantiatingOperationRequest_WithValidParameters_ThenIsCreatedSuccessfully()
        {
            var patientId = new Mock<PatientId>();
            var doctorId = new Mock<StaffGuid>();
            var operationTypeId = new Mock<OperationTypeId>();
            var deadline = DateTime.Now.AddDays(7);
            var priority = "URGENT";

            var operationRequest = new OperationRequest(patientId.Object, doctorId.Object, operationTypeId.Object, deadline, priority);

            Assert.NotNull(operationRequest);
            Assert.Equal(patientId.Object, operationRequest.MedicalRecordNumber);
            Assert.Equal(doctorId.Object, operationRequest.DoctorId);
            Assert.Equal(operationTypeId.Object, operationRequest.OperationTypeId);
            Assert.Equal(deadline, operationRequest.Deadline);
            Assert.Equal(priority, operationRequest.Priority);
            Assert.True(operationRequest.Active);
        }

        [Fact]
        public void WhenInstantiatingOperationRequest_WithNullParameters_ThenThrowsException()
        {
            var doctorId = new Mock<StaffGuid>();
            var operationTypeId = new Mock<OperationTypeId>();
            var deadline = DateTime.Now.AddDays(7);
            var priority = "URGENT";

            Assert.Throws<BusinessRuleValidationException>(() => new OperationRequest(null, doctorId.Object, operationTypeId.Object, deadline, priority));
            Assert.Throws<BusinessRuleValidationException>(() => new OperationRequest(new Mock<PatientId>().Object, null, operationTypeId.Object, deadline, priority));
            Assert.Throws<BusinessRuleValidationException>(() => new OperationRequest(new Mock<PatientId>().Object, doctorId.Object, null, deadline, priority));
            Assert.Throws<BusinessRuleValidationException>(() => new OperationRequest(new Mock<PatientId>().Object, doctorId.Object, operationTypeId.Object, deadline, null));
        }

        [Fact]
        public void WhenChangingDeadline_OnActiveRequest_ThenUpdatesSuccessfully()
        {
            var patientId = new Mock<PatientId>();
            var doctorId = new Mock<StaffGuid>();
            var operationTypeId = new Mock<OperationTypeId>();
            var deadline = DateTime.Now.AddDays(7);
            var priority = "URGENT";
            var operationRequest = new OperationRequest(patientId.Object, doctorId.Object, operationTypeId.Object, deadline, priority);
            var newDeadline = DateTime.Now.AddDays(10);

            operationRequest.ChangeDeadline(newDeadline);

            Assert.Equal(newDeadline, operationRequest.Deadline);
        }

        [Fact]
        public void WhenChangingDeadline_OnInactiveRequest_ThenThrowsException()
        {
            var operationRequest = new OperationRequest(new Mock<PatientId>().Object, new Mock<StaffGuid>().Object, new Mock<OperationTypeId>().Object, DateTime.Now.AddDays(7), "URGENT");
            operationRequest.MarkAsInative();
            var newDeadline = DateTime.Now.AddDays(10);

            Assert.Throws<BusinessRuleValidationException>(() => operationRequest.ChangeDeadline(newDeadline));
        }

        [Fact]
        public void WhenChangingPriority_OnActiveRequest_ThenUpdatesSuccessfully()
        {
            var patientId = new Mock<PatientId>();
            var doctorId = new Mock<StaffGuid>();
            var operationTypeId = new Mock<OperationTypeId>();
            var deadline = DateTime.Now.AddDays(7);
            var priority = "URGENT";
            var operationRequest = new OperationRequest(patientId.Object, doctorId.Object, operationTypeId.Object, deadline, priority);
            var newPriority = "EMERGENCY";

            operationRequest.ChangePriority(newPriority);

            Assert.Equal(newPriority, operationRequest.Priority);
        }

        [Fact]
        public void WhenChangingPriority_OnInactiveRequest_ThenThrowsException()
        {
            var operationRequest = new OperationRequest(new Mock<PatientId>().Object, new Mock<StaffGuid>().Object, new Mock<OperationTypeId>().Object, DateTime.Now.AddDays(7), "URGENT");
            operationRequest.MarkAsInative();
            var newPriority = "EMERGENCY";

            Assert.Throws<BusinessRuleValidationException>(() => operationRequest.ChangePriority(newPriority));
        }

        [Fact]
        public void WhenMarkingAsInactive_ThenIsInactive()
        {
            var operationRequest = new OperationRequest(new Mock<PatientId>().Object, new Mock<StaffGuid>().Object, new Mock<OperationTypeId>().Object, DateTime.Now.AddDays(7), "URGENT");

            operationRequest.MarkAsInative();

            Assert.False(operationRequest.Active);
        }
    }
}