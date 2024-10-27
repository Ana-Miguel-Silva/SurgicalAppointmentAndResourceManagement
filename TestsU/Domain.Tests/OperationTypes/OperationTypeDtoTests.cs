using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using Xunit;

namespace Domain.Tests
{
    public class OperationTypeDtoTests
    {
        [Fact]
        public void Constructor_InitializesProperties_WhenValidParameters()
        {
            var id = Guid.NewGuid();
            var name = "CARDIOLOGY";
            var requiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(1, "CARDIOLOGY", "Doctor"),
                new RequiredStaff(2, "CARDIOLOGY", "Nurse")
            };
            var estimatedDuration = new EstimatedDuration(new TimeOnly(1, 0), new TimeOnly(2, 0), new TimeOnly(0, 30));

            var dto = new OperationTypeDto(id, name, requiredStaff, estimatedDuration);

            Assert.Equal(id, dto.Id);
            Assert.Equal(name, dto.Name);
            Assert.Equal(requiredStaff, dto.RequiredStaff);
            Assert.Equal(estimatedDuration, dto.EstimatedDuration);
        }

        [Fact]
        public void Constructor_ThrowsException_WhenNameIsNull()
        {
            var id = Guid.NewGuid();
            var requiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(1, "CARDIOLOGY", "Doctor")
            };
            var estimatedDuration = new EstimatedDuration(new TimeOnly(1, 0), new TimeOnly(2, 0), new TimeOnly(0, 30));

            Assert.Throws<ArgumentNullException>(() => new OperationTypeDto(id, null, requiredStaff, estimatedDuration));
        }

        [Fact]
        public void Constructor_ThrowsException_WhenRequiredStaffIsNull()
        {
            var id = Guid.NewGuid();
            var name = "CARDIOLOGY";
            var estimatedDuration = new EstimatedDuration(new TimeOnly(1, 0), new TimeOnly(2, 0), new TimeOnly(0, 30));

            Assert.Throws<ArgumentNullException>(() => new OperationTypeDto(id, name, null, estimatedDuration));
        }

        [Fact]
        public void Constructor_ThrowsException_WhenEstimatedDurationIsNull()
        {
            var id = Guid.NewGuid();
            var name = "CARDIOLOGY";
            var requiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(1, "CARDIOLOGY", "Doctor")
            };

            Assert.Throws<ArgumentNullException>(() => new OperationTypeDto(id, name, requiredStaff, null));
        }
    }
}