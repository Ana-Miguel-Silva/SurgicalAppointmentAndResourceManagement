using System;
using System.Threading.Tasks;
using Xunit;
using Moq;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Specializations;
using DDDSample1.ApplicationService.Specializations;

namespace DDDSample1.Tests.ApplicationService
{
    public class SpecializationServiceTests
    {
        [Fact]
        public async Task AddAsync_ShouldCreateSpecialization_WhenValidDtoIsProvided()
        {
            var specializationName = "CARDIOLOGY";
            var specializationDescription = "Heart-related diseases";
            var dto = new CreatingSpecializationDto(specializationName, specializationDescription);

            var mockRepo = new Mock<ISpecializationRepository>();
            var mockUnitOfWork = new Mock<IUnitOfWork>();

            var newSpecialization = new Specialization(specializationName, specializationDescription);

            mockRepo.Setup(r => r.AddAsync(It.IsAny<Specialization>()))
                .ReturnsAsync(newSpecialization);

            mockRepo.Setup(r => r.GetByIdAsync(It.IsAny<SpecializationId>()))
                .ReturnsAsync(newSpecialization);

            var service = new SpecializationService(mockUnitOfWork.Object, mockRepo.Object);

            var result = await service.AddAsync(dto);

            Assert.NotNull(result);
            Assert.Equal(specializationName, result.SpecializationName);
            Assert.Equal(specializationDescription, result.SpecializationDescription);
            mockRepo.Verify(r => r.AddAsync(It.IsAny<Specialization>()), Times.Once);
            mockUnitOfWork.Verify(u => u.CommitAsync(), Times.Once);
        }
    }
}
