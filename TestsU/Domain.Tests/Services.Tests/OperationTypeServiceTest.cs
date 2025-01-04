using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Shared;
using DDDSample1.ApplicationService.OperationTypes;

namespace DDDSample1.Tests
{
    public class OperationTypeServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IOperationTypeRepository> _repoMock;
        private readonly OperationTypeService _service;

        public OperationTypeServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _repoMock = new Mock<IOperationTypeRepository>();
            _service = new OperationTypeService(_unitOfWorkMock.Object, _repoMock.Object);
        }

        [Fact]
        public async Task AddAsync_ShouldReturnOperationTypeDto_WhenValidDataIsProvided()
        {
            var dto = new CreatingOperationTypeDto(
                "Surgery",
                new List<RequiredStaff>
                {
                    new RequiredStaff(1, "SURGEON", "SURGEON")
                },
                new EstimatedDuration(
                    new TimeOnly(1, 0, 0),
                    new TimeOnly(2, 0, 0),
                    new TimeOnly(1, 30, 0)
                )
            );

            var operationType = new OperationType(dto.Name, dto.RequiredStaff, dto.EstimatedDuration);
            _repoMock.Setup(r => r.AddAsync(It.IsAny<OperationType>())).ReturnsAsync(operationType);
            _unitOfWorkMock.Setup(u => u.CommitAsync()).ReturnsAsync(1);

            var result = await _service.AddAsync(dto);

            Assert.NotNull(result);
            Assert.Equal(dto.Name, result.Name);
            Assert.Equal(dto.RequiredStaff.Count, result.RequiredStaff.Count);
            Assert.Equal(dto.EstimatedDuration.PatientPreparation, result.EstimatedDuration.PatientPreparation);
            Assert.Equal(dto.EstimatedDuration.Cleaning, result.EstimatedDuration.Cleaning);
            Assert.Equal(dto.EstimatedDuration.Surgery, result.EstimatedDuration.Surgery);
        }
    }
}
