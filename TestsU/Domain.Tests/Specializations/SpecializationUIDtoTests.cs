using System;
using Xunit;
using DDDSample1.Domain.Specializations;

namespace DDDSample1.Tests
{
    public class SpecializationUIDtoTests
    {
        [Fact]
        public void ShouldInitializeCorrectly_WhenValidDataIsProvided()
        {
            string id = "123";
            string specializationName = "Cardiology";
            string specializationDescription = "Heart-related diseases";

            var dto = new SpecializationUIDto(specializationName, specializationDescription, id);

            Assert.Equal(id, dto.Id);
            Assert.Equal(specializationName, dto.SpecializationName);
            Assert.Equal(specializationDescription, dto.SpecializationDescription);
        }
    }
}
