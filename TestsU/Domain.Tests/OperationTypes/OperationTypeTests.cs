using System;
using System.Collections.Generic;
using Moq;
using Xunit;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.OperationTypes
{
    public class OperationTypeTests
    {
        [Fact]
        public void WhenInstantiatingOperationType_WithValidParameters_ThenIsCreatedSuccessfully()
        {
            var requiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(1, "ONCOLOGY", "Doctor"),
                new RequiredStaff(2, "ONCOLOGY", "Nurse")
            };
            var estimatedDuration = new EstimatedDuration(new TimeOnly(1, 0), new TimeOnly(2, 0), new TimeOnly(0, 30));
            var operationTypeName = "ONCOLOGY";

            var operationType = new OperationType(operationTypeName, requiredStaff, estimatedDuration);

            Assert.NotNull(operationType);
            Assert.Equal(operationTypeName, operationType.Name);
            Assert.Equal(requiredStaff, operationType.RequiredStaff);
            Assert.Equal(estimatedDuration, operationType.EstimatedDuration);
            Assert.True(operationType.Active);
        }

        [Fact]
        public void WhenInstantiatingOperationType_WithNullParameters_ThenThrowsException()
        {
            var requiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(1, "ONCOLOGY", "Doctor")
            };
            var estimatedDuration = new EstimatedDuration(new TimeOnly(1, 0), new TimeOnly(2, 0), new TimeOnly(0, 30));

            Assert.Throws<BusinessRuleValidationException>(() => new OperationType(null, requiredStaff, estimatedDuration));
            Assert.Throws<BusinessRuleValidationException>(() => new OperationType("ONCOLOGY", null, estimatedDuration));
            Assert.Throws<BusinessRuleValidationException>(() => new OperationType("ONCOLOGY", requiredStaff, null));
        }

        [Fact]
        public void WhenChangingEstimatedDuration_OnActiveOperationType_ThenUpdatesSuccessfully()
        {
            var requiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(1, "ONCOLOGY", "Doctor")
            };
            var estimatedDuration = new EstimatedDuration(new TimeOnly(1, 0), new TimeOnly(2, 0), new TimeOnly(0, 30));
            var operationType = new OperationType("ONCOLOGY", requiredStaff, estimatedDuration);
            var newEstimatedDuration = new EstimatedDuration(new TimeOnly(0, 30), new TimeOnly(1, 30), new TimeOnly(0, 15));

            operationType.ChangeEstimatedDuration(newEstimatedDuration);

            Assert.Equal(newEstimatedDuration, operationType.EstimatedDuration);
        }

        [Fact]
        public void WhenChangingEstimatedDuration_OnInactiveOperationType_ThenThrowsException()
        {
            var requiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(1, "ONCOLOGY", "Doctor")
            };
            var estimatedDuration = new EstimatedDuration(new TimeOnly(1, 0), new TimeOnly(2, 0), new TimeOnly(0, 30));
            var operationType = new OperationType("ONCOLOGY", requiredStaff, estimatedDuration);
            operationType.MarkAsInative();
            var newEstimatedDuration = new EstimatedDuration(new TimeOnly(0, 30), new TimeOnly(1, 30), new TimeOnly(0, 15));

            Assert.Throws<BusinessRuleValidationException>(() => operationType.ChangeEstimatedDuration(newEstimatedDuration));
        }

        [Fact]
        public void WhenChangingRequiredStaff_OnActiveOperationType_ThenUpdatesSuccessfully()
        {
            var requiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(1, "ONCOLOGY", "Doctor")
            };
            var estimatedDuration = new EstimatedDuration(new TimeOnly(1, 0), new TimeOnly(2, 0), new TimeOnly(0, 30));
            var operationType = new OperationType("ONCOLOGY", requiredStaff, estimatedDuration);
            var newRequiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(2, "ONCOLOGY", "Nurse")
            };

            operationType.ChangeRequiredStaff(newRequiredStaff);

            Assert.Equal(newRequiredStaff, operationType.RequiredStaff);
        }

        [Fact]
        public void WhenChangingRequiredStaff_WithNullList_ThenThrowsException()
        {
            var requiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(1, "ONCOLOGY", "Doctor")
            };
            var estimatedDuration = new EstimatedDuration(new TimeOnly(1, 0), new TimeOnly(2, 0), new TimeOnly(0, 30));
            var operationType = new OperationType("ONCOLOGY", requiredStaff, estimatedDuration);

            Assert.Throws<BusinessRuleValidationException>(() => operationType.ChangeRequiredStaff(null));
        }

        [Fact]
        public void WhenMarkingAsInactive_ThenIsInactive()
        {
            var requiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(1, "ONCOLOGY", "Doctor")
            };
            var estimatedDuration = new EstimatedDuration(new TimeOnly(1, 0), new TimeOnly(2, 0), new TimeOnly(0, 30));
            var operationType = new OperationType("ONCOLOGY", requiredStaff, estimatedDuration);

            operationType.MarkAsInative();

            Assert.False(operationType.Active);
        }

        [Fact]
        public void WhenChangingName_WithNullName_ThenThrowsException()
        {
            var requiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(1, "ONCOLOGY", "Doctor")
            };
            var estimatedDuration = new EstimatedDuration(new TimeOnly(1, 0), new TimeOnly(2, 0), new TimeOnly(0, 30));
            var operationType = new OperationType("ONCOLOGY", requiredStaff, estimatedDuration);

            Assert.Throws<BusinessRuleValidationException>(() => operationType.ChangeName(null));
        }

        [Fact]
        public void WhenChangingName_WithValidName_ThenUpdatesSuccessfully()
        {
            var requiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(1, "ONCOLOGY", "Doctor")
            };
            var estimatedDuration = new EstimatedDuration(new TimeOnly(1, 0), new TimeOnly(2, 0), new TimeOnly(0, 30));
            var operationType = new OperationType("ONCOLOGY", requiredStaff, estimatedDuration);
            var newName = "OBSTETRICS";

            operationType.ChangeName(newName);

            Assert.Equal(newName, operationType.Name);
        }
    }
}