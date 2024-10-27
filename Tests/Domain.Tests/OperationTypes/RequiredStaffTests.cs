using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using Xunit;

namespace Domain.Tests
{
    public class RequiredStaffTests
    {
        [Fact]
        public void Constructor_ThrowsException_WhenQuantityIsZeroOrNegative()
        {
            Action actZero = () => new RequiredStaff(0, "OBSTETRICS", "Doctor");
            Action actNegative = () => new RequiredStaff(-1, "OBSTETRICS", "Doctor");

            var exceptionZero = Assert.Throws<BusinessRuleValidationException>(actZero);
            Assert.Equal("Quantity must be greater than zero.", exceptionZero.Message);

            var exceptionNegative = Assert.Throws<BusinessRuleValidationException>(actNegative);
            Assert.Equal("Quantity must be greater than zero.", exceptionNegative.Message);
        }

        [Fact]
        public void Constructor_ThrowsException_WhenSpecializationIsNullOrWhitespace()
        {
            Action actNull = () => new RequiredStaff(1, null, "Doctor");
            Action actWhitespace = () => new RequiredStaff(1, " ", "Doctor");

            var exceptionNull = Assert.Throws<BusinessRuleValidationException>(actNull);
            Assert.Equal("Specialization is required.", exceptionNull.Message);

            var exceptionWhitespace = Assert.Throws<BusinessRuleValidationException>(actWhitespace);
            Assert.Equal("Specialization is required.", exceptionWhitespace.Message);
        }

        [Fact]
        public void Constructor_ThrowsException_WhenRoleIsNullOrWhitespace()
        {
            Action actNull = () => new RequiredStaff(1, "OBSTETRICS", null);
            Action actWhitespace = () => new RequiredStaff(1, "OBSTETRICS", " ");

            var exceptionNull = Assert.Throws<BusinessRuleValidationException>(actNull);
            Assert.Equal("Role is required.", exceptionNull.Message);

            var exceptionWhitespace = Assert.Throws<BusinessRuleValidationException>(actWhitespace);
            Assert.Equal("Role is required.", exceptionWhitespace.Message);
        }

        [Fact]
        public void Constructor_SetsProperties_WhenValidArguments()
        {
            var quantity = 3;
            var specialization = "OBSTETRICS";
            var role = "Doctor";

            var requiredStaff = new RequiredStaff(quantity, specialization, role);

            Assert.Equal(quantity, requiredStaff.Quantity);
            Assert.Equal(specialization, requiredStaff.Specialization);
            Assert.Equal(role, requiredStaff.Role);
        }

        [Fact]
        public void GetEqualityComponents_ReturnsCorrectComponents()
        {
            var requiredStaff = new RequiredStaff(3, "OBSTETRICS", "Doctor");
            var expectedComponents = new List<object> { 3, "OBSTETRICS", "Doctor" };

            var components = requiredStaff.GetEqualityComponents();

            Assert.Equal(expectedComponents, components);
        }
    }
}