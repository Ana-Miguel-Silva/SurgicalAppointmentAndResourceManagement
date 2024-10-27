using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using Xunit;

namespace Domain.Tests
{
    public class EstimatedDurationTests
    {
        [Fact]
        public void Constructor_ThrowsException_WhenAnyDurationIsDefault()
        {
            TimeOnly defaultTime = default;
            TimeOnly validPreparation = new TimeOnly(1, 30);
            TimeOnly validSurgery = new TimeOnly(2, 0);
            TimeOnly validCleaning = new TimeOnly(0, 30);

            Assert.Throws<BusinessRuleValidationException>(() => new EstimatedDuration(defaultTime, validSurgery, validCleaning));
            Assert.Throws<BusinessRuleValidationException>(() => new EstimatedDuration(validPreparation, defaultTime, validCleaning));
            Assert.Throws<BusinessRuleValidationException>(() => new EstimatedDuration(validPreparation, validSurgery, defaultTime));
        }

        [Fact]
        public void Constructor_SetsProperties_WhenValidDurationsProvided()
        {
            var patientPreparation = new TimeOnly(1, 30);
            var surgery = new TimeOnly(2, 0);
            var cleaning = new TimeOnly(0, 30);

            var estimatedDuration = new EstimatedDuration(patientPreparation, surgery, cleaning);

            Assert.Equal(patientPreparation, estimatedDuration.PatientPreparation);
            Assert.Equal(surgery, estimatedDuration.Surgery);
            Assert.Equal(cleaning, estimatedDuration.Cleaning);
        }

        [Fact]
        public void GetTotalDuration_ReturnsCorrectTotalDuration()
        {
            var patientPreparation = new TimeOnly(1, 30);
            var surgery = new TimeOnly(2, 0);
            var cleaning = new TimeOnly(0, 30);
            var estimatedDuration = new EstimatedDuration(patientPreparation, surgery, cleaning);

            TimeOnly totalDuration = estimatedDuration.GetTotalDuration();

            Assert.Equal(new TimeOnly(4, 0), totalDuration);
        }

        [Fact]
        public void GetEqualityComponents_ReturnsCorrectComponents()
        {
            var patientPreparation = new TimeOnly(1, 30);
            var surgery = new TimeOnly(2, 0);
            var cleaning = new TimeOnly(0, 30);
            var estimatedDuration = new EstimatedDuration(patientPreparation, surgery, cleaning);
            var expectedComponents = new List<object> { patientPreparation, surgery, cleaning };

            var components = estimatedDuration.GetEqualityComponents();

            Assert.Equal(expectedComponents, components);
        }
    }
}