using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using Xunit;

namespace Domain.Tests
{
    public class UpdateStaffDtoTests
    {

        [Fact]
        public void Constructor_InitializesProperties_WhenValidParameters()
        {
            var email = "1221148@isep.ipp.pt";
            var phone = "987654322";
            var specialization = "CARDIOLOGY";

            var dto = new UpdateStaffDto(email, phone, specialization);

            Assert.Equal(email, dto.Email);
            Assert.Equal(phone, dto.PhoneNumber);
            Assert.Equal(specialization, dto.Specialization);
        }
        
    }
}