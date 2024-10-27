using DDDSample1.Domain.Users;
using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using Xunit;

namespace Domain.Tests
{
    public class CreatingUserDtoTests
    {
        [Fact]
        public void Constructor_InitializesProperties_WhenValidParameters()
        {
            var email = "user@gmail.com";
            var name = "user";
            var role = "ADMIN";

            var dto = new CreatingUserDto(name, email, role);

            Assert.Equal(name, dto.Username);
            Assert.Equal(email, dto.Email);
            Assert.Equal(role, dto.Role);
        }
    }
}