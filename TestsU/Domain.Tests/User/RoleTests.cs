using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using System;
using System.Collections.Generic;
using Xunit;

namespace Domain.Tests
{
    public class RoleTests
    {

        [Fact]
        public void ValidRoles()
        {
            Assert.True(Role.IsValid("ADMIN"));
            Assert.True(Role.IsValid("PATIENT"));
            Assert.True(Role.IsValid("DOCTOR"));
            Assert.True(Role.IsValid("NURSE"));
            Assert.True(Role.IsValid("TECHNICIAN"));
        }
        public void InvalidRoles()
        {
            Assert.True(Role.IsValid("PEDIATRICS"));
            Assert.True(Role.IsValid("SURGERY"));
            Assert.True(Role.IsValid("CARDIOLOGY"));
            Assert.True(Role.IsValid("ORTHOPEDICS"));
            Assert.True(Role.IsValid("ANAESTHESIOLOGY"));
            Assert.True(Role.IsValid("NEUROLOGY"));
            Assert.True(Role.IsValid("ONCOLOGY"));
            Assert.True(Role.IsValid("GYNECOLOGY"));
            Assert.True(Role.IsValid("OBSTETRICS"));
            Assert.True(Role.IsValid("RADIOLOGY"));
            Assert.True(Role.IsValid("UROLOGY"));
        }
        
    }
}