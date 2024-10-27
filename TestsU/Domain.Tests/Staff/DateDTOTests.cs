using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using Xunit;

namespace Domain.Tests
{
    public class DateDTOTests
    {

        [Fact]
        public void Constructor_InitializesProperties_WhenValidParameters()
        {
            var start = "20/10/2024 10:00";
            var end = "20/10/2024 10:15";

            var dto = new DateDTO(start, end);

            Assert.Equal(start, dto.Start);
            Assert.Equal(end, dto.End);
        }
        
    }
}