using System;
using Xunit;
using DDDSample1.Domain.OperationRequests;

namespace DDDSample1.Tests.Domain.OperationRequests
{
    public class UpdateOperationRequestDtoTests
    {
        [Fact]
        public void UpdateOperationRequestDto_WithValidParameters_ThenIsCreatedSuccessfully()
        {
            var id = Guid.NewGuid();
            var deadline = DateTime.Now.AddDays(5);
            var priority = "URGENT";

            var updateDto = new UpdateOperationRequestDto(id, deadline, priority);

            Assert.NotNull(updateDto);
            Assert.Equal(id, updateDto.Id);
            Assert.Equal(deadline, updateDto.Deadline);
            Assert.Equal(priority, updateDto.Priority);
        }
    }
}
