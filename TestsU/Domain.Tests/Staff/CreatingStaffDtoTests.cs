using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using Xunit;

namespace Domain.Tests
{
    public class CreatingStaffDtoTests
    {

        [Fact]
        public void Constructor_InitializesProperties_WhenValidParameters()
        {
            var name = "Ivo Gerald Robotnik";
            var email = "1221148@isep.ipp.pt";
            var phone = "987654322";
            var role = "DOCTOR";
            var specialization = "CARDIOLOGY";
            var slots = new List<DateDTO>
            {
                new DateDTO("20/10/2024 10:00", "20/10/2024 10:15")
            };

            var dto = new CreatingStaffDto(name, email, phone, role, specialization, slots);

            Assert.Equal(name, dto.Name);
            Assert.Equal(email, dto.Email);
            Assert.Equal(phone, dto.PhoneNumber);
            Assert.Equal(role, dto.Role);
            Assert.Equal(specialization, dto.Specialization);
            Assert.Equal(slots, dto.Slots);
        }
        
    }
}