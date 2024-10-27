using DDDSample1.Domain.Users;
using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using Xunit;

namespace Domain.Tests
{
    public class UserDtoTests
    {
        [Fact]
        public void Constructor_InitializesProperties_WhenValidParameters()
        {
            var email = new Email("user@gmail.com");
            var name = "user";
            var role = "ADMIN";
            var id = new Guid();

            var dto = new UserDto(id, name, email, role);

            Assert.Equal(id, dto.Id);
            Assert.Equal(name, dto.Username);
            Assert.Equal(email, dto.Email);
            Assert.Equal(role, dto.Role);
        }
    }
}