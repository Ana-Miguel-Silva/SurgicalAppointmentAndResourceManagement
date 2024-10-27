using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using Xunit;

namespace Domain.Tests
{
    public class CreatingOperationTypeDtoTests
    {
        [Fact]
        public void Constructor_InitializesProperties_WhenValidParameters()
        {
            var requiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(1, "CARDIOLOGY", "Doctor"),
                new RequiredStaff(2, "CARDIOLOGY", "Nurse")
            };
            var estimatedDuration = new EstimatedDuration(new TimeOnly(1, 0), new TimeOnly(2, 0), new TimeOnly(0, 30));
            var name = "CARDIOLOGY";

            var dto = new CreatingOperationTypeDto(name, requiredStaff, estimatedDuration);

            Assert.Equal(name, dto.Name);
            Assert.Equal(requiredStaff, dto.RequiredStaff);
            Assert.Equal(estimatedDuration, dto.EstimatedDuration);
        }

        [Fact]
        public void Constructor_ThrowsException_WhenNameIsNull()
        {
            var requiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(1, "CARDIOLOGY", "Doctor")
            };
            var estimatedDuration = new EstimatedDuration(new TimeOnly(1, 0), new TimeOnly(2, 0), new TimeOnly(0, 30));

            Assert.Throws<ArgumentNullException>(() => new CreatingOperationTypeDto(null, requiredStaff, estimatedDuration));
        }

        [Fact]
        public void Constructor_ThrowsException_WhenRequiredStaffIsNull()
        {
            var estimatedDuration = new EstimatedDuration(new TimeOnly(1, 0), new TimeOnly(2, 0), new TimeOnly(0, 30));
            var name = "CARDIOLOGY";

            Assert.Throws<ArgumentNullException>(() => new CreatingOperationTypeDto(name, null, estimatedDuration));
        }

        [Fact]
        public void Constructor_ThrowsException_WhenEstimatedDurationIsNull()
        {
            var requiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(1, "CARDIOLOGY", "Doctor")
            };
            var name = "CARDIOLOGY";

            Assert.Throws<ArgumentNullException>(() => new CreatingOperationTypeDto(name, requiredStaff, null));
        }
    }
}