using System;
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
            var patientId = new PatientId(Guid.NewGuid());
            var doctorId = new StaffGuid(Guid.NewGuid());
            var operationTypeId = new OperationTypeId(Guid.NewGuid());
            var deadline = DateTime.Now.AddDays(7);
            var priority = "URGENT";

            var operationRequest = new OperationRequest(patientId, doctorId, operationTypeId, deadline, priority);

            Assert.NotNull(operationRequest);
            Assert.Equal(patientId, operationRequest.MedicalRecordNumber);
            Assert.Equal(doctorId, operationRequest.DoctorId);
            Assert.Equal(operationTypeId, operationRequest.OperationTypeId);
            Assert.Equal(deadline, operationRequest.Deadline);
            Assert.Equal(priority, operationRequest.Priority);
            Assert.True(operationRequest.Active);
        }

        [Fact]
        public void WhenInstantiatingOperationRequest_WithNullParameters_ThenThrowsException()
        {
            var patientId = new PatientId(Guid.NewGuid());
            var doctorId = new StaffGuid(Guid.NewGuid());
            var operationTypeId = new OperationTypeId(Guid.NewGuid());
            var deadline = DateTime.Now.AddDays(7);
            var priority = "URGENT";

            Assert.Throws<BusinessRuleValidationException>(() => new OperationRequest(null, doctorId, operationTypeId, deadline, priority));
            Assert.Throws<BusinessRuleValidationException>(() => new OperationRequest(patientId, null, operationTypeId, deadline, priority));
            Assert.Throws<BusinessRuleValidationException>(() => new OperationRequest(patientId, doctorId, null, deadline, priority));
            Assert.Throws<BusinessRuleValidationException>(() => new OperationRequest(patientId, doctorId, operationTypeId, deadline, null));
        }

        [Fact]
        public void WhenChangingDeadline_OnActiveRequest_ThenUpdatesSuccessfully()
        {
            var patientId = new PatientId(Guid.NewGuid());
            var doctorId = new StaffGuid(Guid.NewGuid());
            var operationTypeId = new OperationTypeId(Guid.NewGuid());
            var deadline = DateTime.Now.AddDays(7);
            var priority = "URGENT";
            var operationRequest = new OperationRequest(patientId, doctorId, operationTypeId, deadline, priority);
            var newDeadline = DateTime.Now.AddDays(10);

            operationRequest.ChangeDeadline(newDeadline);

            Assert.Equal(newDeadline, operationRequest.Deadline);
        }

        [Fact]
        public void WhenChangingDeadline_OnInactiveRequest_ThenThrowsException()
        {
            var patientId = new PatientId(Guid.NewGuid());
            var doctorId = new StaffGuid(Guid.NewGuid());
            var operationTypeId = new OperationTypeId(Guid.NewGuid());
            var operationRequest = new OperationRequest(patientId, doctorId, operationTypeId, DateTime.Now.AddDays(7), "URGENT");
            operationRequest.MarkAsInative();
            var newDeadline = DateTime.Now.AddDays(10);

            Assert.Throws<BusinessRuleValidationException>(() => operationRequest.ChangeDeadline(newDeadline));
        }

        [Fact]
        public void WhenChangingPriority_OnActiveRequest_ThenUpdatesSuccessfully()
        {
            var patientId = new PatientId(Guid.NewGuid());
            var doctorId = new StaffGuid(Guid.NewGuid());
            var operationTypeId = new OperationTypeId(Guid.NewGuid());
            var deadline = DateTime.Now.AddDays(7);
            var priority = "URGENT";
            var operationRequest = new OperationRequest(patientId, doctorId, operationTypeId, deadline, priority);
            var newPriority = "EMERGENCY";

            operationRequest.ChangePriority(newPriority);

            Assert.Equal(newPriority, operationRequest.Priority);
        }

        [Fact]
        public void WhenChangingPriority_OnInactiveRequest_ThenThrowsException()
        {
            var patientId = new PatientId(Guid.NewGuid());
            var doctorId = new StaffGuid(Guid.NewGuid());
            var operationTypeId = new OperationTypeId(Guid.NewGuid());
            var operationRequest = new OperationRequest(patientId, doctorId, operationTypeId, DateTime.Now.AddDays(7), "URGENT");
            operationRequest.MarkAsInative();
            var newPriority = "EMERGENCY";

            Assert.Throws<BusinessRuleValidationException>(() => operationRequest.ChangePriority(newPriority));
        }

        [Fact]
        public void WhenMarkingAsInactive_ThenIsInactive()
        {
            var patientId = new PatientId(Guid.NewGuid());
            var doctorId = new StaffGuid(Guid.NewGuid());
            var operationTypeId = new OperationTypeId(Guid.NewGuid());
            var operationRequest = new OperationRequest(patientId, doctorId, operationTypeId, DateTime.Now.AddDays(7), "URGENT");

            operationRequest.MarkAsInative();

            Assert.False(operationRequest.Active);
        }

        [Fact]
        public void WhenMarkingAsActive_ThenIsActive()
        {
            var patientId = new PatientId(Guid.NewGuid());
            var doctorId = new StaffGuid(Guid.NewGuid());
            var operationTypeId = new OperationTypeId(Guid.NewGuid());
            var operationRequest = new OperationRequest(patientId, doctorId, operationTypeId, DateTime.Now.AddDays(7), "URGENT");
            operationRequest.MarkAsInative();

            operationRequest.MarkAsActive();

            Assert.True(operationRequest.Active);
        }
    }
}
