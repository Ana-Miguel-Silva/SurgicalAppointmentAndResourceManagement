using System;
using Xunit;
using DDDSample1.Domain.Specializations;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests
{
    public class SpecializationTests
    {
        [Fact]
        public void ShouldThrowException_WhenInvalidDataIsProvided()
        {
            Assert.Throws<BusinessRuleValidationException>(() =>
                new Specialization(null, "Description")
            );

            Assert.Throws<BusinessRuleValidationException>(() =>
                new Specialization("Orthopedics", null)
            );
        }

        [Fact]
        public void ShouldInitializeCorrectly_WhenValidDataIsProvided()
        {
            string specializationName = "Radiology";
            string specializationDescription = "Imaging and diagnostic procedures";

            var specialization = new Specialization(specializationName, specializationDescription);

            Assert.Equal(specializationName.ToUpper(), specialization.SpecializationName);
            Assert.Equal(specializationDescription, specialization.SpecializationDescription);
        }

        [Fact]
        public void UpdateName_ShouldUpdateSpecializationName_WhenValidNameIsProvided()
        {
            var specialization = new Specialization("Dermatology", "Skin-related treatments");

            specialization.updateName("Oncology");

            Assert.Equal("ONCOLOGY", specialization.SpecializationName);
        }

        [Fact]
        public void UpdateDescription_ShouldUpdateSpecializationDescription_WhenValidDescriptionIsProvided()
        {
            var specialization = new Specialization("Pediatrics", "Children's health care");

            specialization.updateDescription("Medical care for children");

            Assert.Equal("Medical care for children", specialization.SpecializationDescription);
        }
    }
}
