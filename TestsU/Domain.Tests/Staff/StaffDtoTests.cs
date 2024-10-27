using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using Xunit;

namespace Domain.Tests
{
    public class StaffDtoTests
    {
        [Fact]
        public void Constructor_InitializesProperties_WhenValidParameters()
        {
            var id = Guid.NewGuid();
            var name = new FullName("Ivo Gerald Robotnik");
            var email = new Email("1221148@isep.ipp.pt");
            var phone = new PhoneNumber("987654322");
            var role = "DOCTOR";
            var specialization = "CARDIOLOGY";
            var slots = new List<Slot>
            {
                new Slot("20/10/2024 10:00", "20/10/2024 10:15")
            };
            var staffID = "D20240";
            var licenseNumber = "D20240";
            var active = true;

            var dto = new StaffDto(id, name, email, phone, role, specialization, slots, staffID, licenseNumber,active);

            Assert.Equal(name, dto.Name);
            Assert.Equal(email, dto.Email);
            Assert.Equal(phone, dto.PhoneNumber);
            Assert.Equal(role, dto.Role);
            Assert.Equal(specialization, dto.Specialization);
            Assert.Equal(slots, dto.Slots);
            Assert.Equal(staffID, dto.StaffId);
            Assert.Equal(licenseNumber, dto.LicenseNumber);
            Assert.Equal(active, dto.Active);
        }

    }
}