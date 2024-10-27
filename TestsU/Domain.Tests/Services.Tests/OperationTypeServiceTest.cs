/*using Xunit;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.ApplicationService.OperationTypes;

namespace Backend.Tests.Services
{
    public class OperationTypeServiceTest
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IOperationTypeRepository> _operationTypeRepositoryMock;
        private readonly OperationTypeService _operationTypeService;

        public OperationTypeServiceTest()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _operationTypeRepositoryMock = new Mock<IOperationTypeRepository>();

            _operationTypeService = new OperationTypeService(
                _unitOfWorkMock.Object,
                _operationTypeRepositoryMock.Object
            );
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnOperationTypeDtoList()
        {
            // Arrange
            var operationTypes = new List<OperationType>
            {
                new OperationType("Operation A", new List<RequiredStaff> { new RequiredStaff(1, "Nurse", "Nursing") }, new EstimatedDuration(TimeOnly.FromHours(1), TimeOnly.FromHours(2), TimeOnly.FromMinutes(30)))
            };

            _operationTypeRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(operationTypes);

            // Act
            var result = await _operationTypeService.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(operationTypes.Count, result.Count);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnOperationTypeDto()
        {
            // Arrange
            var operationType = new OperationType("Operation A", new List<RequiredStaff> { new RequiredStaff(1, "Nurse", "Nursing") }, new EstimatedDuration(TimeOnly.FromHours(1), TimeOnly.FromHours(2), TimeOnly.FromMinutes(30)));
            var operationTypeId = operationType.Id;

            _operationTypeRepositoryMock.Setup(repo => repo.GetByIdAsync(operationTypeId)).ReturnsAsync(operationType);

            // Act
            var result = await _operationTypeService.GetByIdAsync(operationTypeId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(operationTypeId.AsGuid(), result.Id);
        }

        [Fact]
        public async Task AddAsync_ShouldReturnOperationTypeDto()
        {
            // Arrange
            var dto = new CreatingOperationTypeDto("Operation B", new List<RequiredStaff> { new RequiredStaff(1, "Doctor", "Surgery") }, new EstimatedDuration(TimeOnly.FromHours(1), TimeOnly.FromHours(2), TimeOnly.FromMinutes(30)));

            var expectedOperationType = new OperationType(dto.Name, dto.RequiredStaff, dto.EstimatedDuration);

            _operationTypeRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<OperationType>()))
                .ReturnsAsync(expectedOperationType);
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0));

            // Act
            var result = await _operationTypeService.AddAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.Name, result.Name);
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnUpdatedOperationTypeDto()
        {
            // Arrange
            var dto = new OperationTypeDto(Guid.NewGuid(), "Updated Operation", new List<RequiredStaff> { new RequiredStaff(2, "Nurse", "Assisting") }, new EstimatedDuration(TimeOnly.FromHours(1), TimeOnly.FromHours(3), TimeOnly.FromMinutes(15)));

            var operationType = new OperationType("Operation A", new List<RequiredStaff> { new RequiredStaff(1, "Nurse", "Nursing") }, new EstimatedDuration(TimeOnly.FromHours(1), TimeOnly.FromHours(2), TimeOnly.FromMinutes(30)));

            _operationTypeRepositoryMock.Setup(repo => repo.GetByIdAsync(new OperationTypeId(dto.Id))).ReturnsAsync(operationType);
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0));

            // Act
            var result = await _operationTypeService.UpdateAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.Name, result.Name);
        }

        [Fact]
        public async Task InactivateAsync_ShouldReturnInactivatedOperationTypeDto()
        {
            // Arrange
            var operationType = new OperationType("Operation A", new List<RequiredStaff> { new RequiredStaff(1, "Nurse", "Nursing") }, new EstimatedDuration(TimeOnly.FromHours(1), TimeOnly.FromHours(2), TimeOnly.FromMinutes(30)));
            var operationTypeId = operationType.Id;

            _operationTypeRepositoryMock.Setup(repo => repo.GetByIdAsync(operationTypeId)).ReturnsAsync(operationType);
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0));

            // Act
            var result = await _operationTypeService.InactivateAsync(operationTypeId);

            // Assert
            Assert.NotNull(result);
            Assert.False(operationType.Active);
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnDeletedOperationTypeDto()
        {
            // Arrange
            var operationType = new OperationType("Operation A", new List<RequiredStaff> { new RequiredStaff(1, "Nurse", "Nursing") }, new EstimatedDuration(TimeOnly.FromHours(1), TimeOnly.FromHours(2), TimeOnly.FromMinutes(30)));
            operationType.MarkAsInative(); // Assuming a MarkAsInative method exists
            var operationTypeId = operationType.Id;

            _operationTypeRepositoryMock.Setup(repo => repo.GetByIdAsync(operationTypeId)).ReturnsAsync(operationType);
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0));

            // Act
            var result = await _operationTypeService.DeleteAsync(operationTypeId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(operationTypeId.AsGuid(), result.Id);
        }
    }
}*/