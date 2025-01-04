using System;
using Xunit;
using DDDSample1.Domain.Specializations;

namespace DDDSample1.Tests
{
    public class CreatingSpecializationDtoTests
    {
        [Fact]
        public void ShouldInitializeCorrectly_WhenValidDataIsProvided()
        {
            string specializationName = "Orthopedics";
            string specializationDescription = "Bone and joint related treatments";

            var dto = new CreatingSpecializationDto(specializationName, specializationDescription);

            Assert.Equal(specializationName, dto.SpecializationName);
            Assert.Equal(specializationDescription, dto.SpecializationDescription);
        }
    }
}
