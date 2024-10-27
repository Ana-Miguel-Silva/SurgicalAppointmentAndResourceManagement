using System;
using Xunit;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.PendingActions;

namespace Domain.Tests
{
    public class PendingActionsEntryTests
    {
        [Fact]
        public void SetAction_UpdatesActionProperty()
        {
            // Arrange
            var pendingAction = new PendingActionsEntry("Initial Action");
            var newAction = "Updated Action";

            // Act
            pendingAction.Action = newAction;

            // Assert
            Assert.Equal(newAction, pendingAction.Action);
        }
    }
}
