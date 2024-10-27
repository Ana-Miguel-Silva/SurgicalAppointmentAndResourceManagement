using System.Threading.Tasks;
using Moq;
using Xunit;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.PendingActions;
using DDDSample1.ApplicationService.PendingActions;

namespace Backend.Tests.Services
{
    public class PendingActionsServiceTest
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IPendingActionsRepository> _pendingActionsRepositoryMock;
        private readonly PendingActionsService _pendingActionsService;

        public PendingActionsServiceTest()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _pendingActionsRepositoryMock = new Mock<IPendingActionsRepository>();
            _pendingActionsService = new PendingActionsService(_unitOfWorkMock.Object, _pendingActionsRepositoryMock.Object);
        }

        [Fact]
        public async Task PendingActionsAsync_ShouldAddPendingActionAndReturnEntry()
        {
            // Arrange
            var action = "TestAction";
            var pendingActionsEntry = new PendingActionsEntry(action);

            _pendingActionsRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<PendingActionsEntry>())).ReturnsAsync(pendingActionsEntry);
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0));

            // Act
            var result = await _pendingActionsService.PendingActionsAsync(action);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(action, result.Action);
            _pendingActionsRepositoryMock.Verify(repo => repo.AddAsync(It.IsAny<PendingActionsEntry>()), Times.Once);
            _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task TryRemove_ShouldReturnTrueAndRemoveEntry_WhenEntryExists()
        {
            // Arrange
            var actionId = new PendingActionsId(Guid.NewGuid());
            var pendingActionsEntry = new PendingActionsEntry("TestAction") ;

            _pendingActionsRepositoryMock.Setup(repo => repo.GetByIdAsync(actionId)).ReturnsAsync(pendingActionsEntry);
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0));

            // Act
            var result = await _pendingActionsService.TryRemove(actionId);

            // Assert
            Assert.True(result);
            _pendingActionsRepositoryMock.Verify(repo => repo.Remove(pendingActionsEntry), Times.Once);
            _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task TryRemove_ShouldReturnFalse_WhenEntryDoesNotExist()
        {
            // Arrange
            var actionId = new PendingActionsId(Guid.Empty);
            _pendingActionsRepositoryMock.Setup(repo => repo.GetByIdAsync(actionId)).ReturnsAsync((PendingActionsEntry)null);

            // Act
            var result = await _pendingActionsService.TryRemove(actionId);

            // Assert
            Assert.False(result);
            _pendingActionsRepositoryMock.Verify(repo => repo.Remove(It.IsAny<PendingActionsEntry>()), Times.Never);
            _unitOfWorkMock.Verify(uow => uow.CommitAsync(), Times.Never);
        }

        [Fact]
        public async Task FindbyId_ShouldReturnAction_WhenEntryExists()
        {
            // Arrange
            var actionId = new PendingActionsId(Guid.NewGuid());
            var action = "TestAction";
            var pendingActionsEntry = new PendingActionsEntry(action) ;

            _pendingActionsRepositoryMock.Setup(repo => repo.GetByIdAsync(actionId)).ReturnsAsync(pendingActionsEntry);

            // Act
            var result = await _pendingActionsService.FindbyId(actionId);

            // Assert
            Assert.Equal(action, result);
        }

        [Fact]
        public async Task FindbyId_ShouldReturnNull_WhenEntryDoesNotExist()
        {
            // Arrange
            var actionId = new PendingActionsId(Guid.NewGuid());
            _pendingActionsRepositoryMock.Setup(repo => repo.GetByIdAsync(actionId)).ReturnsAsync((PendingActionsEntry)null);

            // Act
            var result = await _pendingActionsService.FindbyId(actionId);

            // Assert
            Assert.Null(result);
        }
    }
}
