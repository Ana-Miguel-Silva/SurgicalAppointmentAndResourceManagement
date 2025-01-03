using System;
using Xunit;
using DDDSample1.Domain.OperationRequests;

namespace DDDSample1.Tests.Domain.OperationRequests
{
    public class PriorityTests
    {
        [Fact]
        public void Priorities_ReturnsAllPriorityOptions()
        {
            var priorities = Priority.Priorities();

            Assert.Contains("ELECTIVE", priorities);
            Assert.Contains("URGENT", priorities);
            Assert.Contains("EMERGENCY", priorities);
        }

        [Fact]
        public void IsValid_WithValidPriority_ReturnsTrue()
        {
            Assert.True(Priority.IsValid("ELECTIVE"));
            Assert.True(Priority.IsValid("URGENT"));
            Assert.True(Priority.IsValid("EMERGENCY"));
        }

        [Fact]
        public void IsValid_WithInvalidPriority_ReturnsFalse()
        {
            Assert.False(Priority.IsValid("INVALID_PRIORITY"));
            Assert.False(Priority.IsValid(null));
        }
    }
}
