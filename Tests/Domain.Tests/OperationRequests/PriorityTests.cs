using Xunit;
using DDDSample1.Domain.OperationRequests;

namespace DDDSample1.Tests.Domain.OperationRequests
{
    public class PriorityTests
    {
        [Fact]
        public void Priorities_ShouldReturnExpectedPriorityList()
        {
            string[] expectedPriorities = { Priority.ELECTIVE, Priority.URGENT, Priority.EMERGENCY };

            string[] result = Priority.Priorities();

            Assert.Equal(expectedPriorities, result);
        }

        [Theory]
        [InlineData("ELECTIVE", true)]
        [InlineData("URGENT", true)]
        [InlineData("EMERGENCY", true)]
        [InlineData("NON_EXISTENT_PRIORITY", false)]
        [InlineData("", false)]
        [InlineData(null, false)]
        public void IsValid_ShouldReturnCorrectBooleanBasedOnPriority(string priority, bool expectedValidity)
        {
            bool result = Priority.IsValid(priority);

            Assert.Equal(expectedValidity, result);
        }
    }
}