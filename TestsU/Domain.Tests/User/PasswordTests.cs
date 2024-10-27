using DDDSample1.Domain.Users;
using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using Xunit;

namespace Domain.Tests
{
    public class PasswordTests
    {
        [Fact]
        public void Constructor_InitializesProperties_WhenValidParameters()
        {
            var plainTextPassword = "#Password1";
            var password = new Password(plainTextPassword);
            
            Assert.True(BCrypt.Net.BCrypt.Verify(plainTextPassword, password.Pass));
        }


        [Fact]
        public void Constructor_InitializesProperties_WhenInValidParameters()
        {
            var p = "#Pass";           

            Assert.Throws<ArgumentException>(() => new Password(p));
        }
    }
}