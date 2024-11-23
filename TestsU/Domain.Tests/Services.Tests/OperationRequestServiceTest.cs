using Xunit;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.ApplicationService.OperationRequests;
using Microsoft.Extensions.Configuration;

namespace Backend.Tests.Services
{
    public class OperationRequestServiceTest
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IOperationRequestRepository> _operationRequestRepositoryMock;
        private readonly Mock<IPatientRepository> _patientRepositoryMock;
        private readonly Mock<IStaffRepository> _staffRepositoryMock;
        private readonly Mock<IOperationTypeRepository> _operationTypeRepositoryMock;
        private readonly OperationRequestService _operationRequestService;

        public OperationRequestServiceTest()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _operationRequestRepositoryMock = new Mock<IOperationRequestRepository>();
            _patientRepositoryMock = new Mock<IPatientRepository>();
            _staffRepositoryMock = new Mock<IStaffRepository>();
            _operationTypeRepositoryMock = new Mock<IOperationTypeRepository>();

            _operationRequestService = new OperationRequestService(
                _unitOfWorkMock.Object,
                _operationRequestRepositoryMock.Object,
                _patientRepositoryMock.Object,
                _staffRepositoryMock.Object,
                _operationTypeRepositoryMock.Object
            );
        }

        /*[Fact]
        public async Task GetAllAsync_ShouldReturnOperationRequestDTOList()
        {
            // Arrange
            var operationRequests = new List<OperationRequest>
            {
                new OperationRequest(
                    new PatientId(Guid.NewGuid()),
                    new StaffGuid(Guid.NewGuid()),
                    new OperationTypeId(Guid.NewGuid()),
                    DateTime.Now.AddDays(7),
                    "URGENT"
                )
            };

            _operationRequestRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(operationRequests);

            // Act
            var result = await _operationRequestService.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(operationRequests.Count, result.Count);
        }*/

        [Fact]
        public async Task GetByIdAsync_ShouldReturnOperationRequestDTO()
        {
            // Arrange
            var operationRequest = new OperationRequest(
                new PatientId(Guid.NewGuid()),
                new StaffGuid(Guid.NewGuid()),
                new OperationTypeId(Guid.NewGuid()),
                DateTime.Now.AddDays(7),
                "URGENT"
            );
            var operationRequestId = operationRequest.Id;

            _operationRequestRepositoryMock.Setup(repo => repo.GetByIdAsync(operationRequestId)).ReturnsAsync(operationRequest);

            // Act
            var result = await _operationRequestService.GetByIdAsync(operationRequestId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(operationRequestId.AsGuid(), result.Id);
        }

        [Fact]
        public async Task InactivateAsync_ShouldReturnInactivatedOperationRequestDTO()
        {
            // Arrange
            var operationRequest = new OperationRequest(
                new PatientId(Guid.NewGuid()),
                new StaffGuid(Guid.NewGuid()),
                new OperationTypeId(Guid.NewGuid()),
                DateTime.Now.AddDays(7),
                "URGENT"
            );
            var operationRequestId = operationRequest.Id;

            _operationRequestRepositoryMock.Setup(repo => repo.GetByIdAsync(operationRequestId)).ReturnsAsync(operationRequest);
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0)); // Fix: Change Task.CompletedTask to Task.FromResult(0)

            // Act
            var result = await _operationRequestService.InactivateAsync(operationRequestId);

            // Assert
            Assert.NotNull(result);
            Assert.False(operationRequest.Active);
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnDeletedOperationRequestDTO()
        {
            // Arrange
            var operationRequest = new OperationRequest(
                new PatientId(Guid.NewGuid()),
                new StaffGuid(Guid.NewGuid()),
                new OperationTypeId(Guid.NewGuid()),
                DateTime.Now.AddDays(7),
                "URGENT"
            );
            operationRequest.MarkAsInative();
            var operationRequestId = operationRequest.Id;

            _operationRequestRepositoryMock.Setup(repo => repo.GetByIdAsync(operationRequestId)).ReturnsAsync(operationRequest);
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0)); // Fix: Change Task.CompletedTask to Task.FromResult(0)

            // Act
            var result = await _operationRequestService.DeleteAsync(operationRequestId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(operationRequestId.AsGuid(), result.Id);
        }
    }
}