using System;
using Xunit;
using DDDSample1.Domain.Specializations;

namespace DDDSample1.Tests
{
    public class SpecializationDtoTests
    {
        [Fact]
        public void ShouldInitializeCorrectly_WhenValidDataIsProvided()
        {
            Guid id = Guid.NewGuid();
            string specializationName = "Neurology";
            string specializationDescription = "Brain and nervous system disorders";

            var dto = new SpecializationDto(id, specializationName, specializationDescription);

            Assert.Equal(id, dto.Id);
            Assert.Equal(specializationName, dto.SpecializationName);
            Assert.Equal(specializationDescription, dto.SpecializationDescription);
        }
    }
}
