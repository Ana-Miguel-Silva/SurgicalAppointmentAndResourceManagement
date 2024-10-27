using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using System;
using System.Collections.Generic;
using Xunit;

namespace Domain.Tests
{
    public class GenderTests
    {

        [Fact]
        public void ValidGenders()
        {
            Assert.True(Gender.IsValid("MALE"));
            Assert.True(Gender.IsValid("FEMALE"));
        }
        public void InvalidGenders()
        {
            Assert.True(Gender.IsValid("PEDIATRICS"));
            Assert.True(Gender.IsValid("SURGERY"));
            Assert.True(Gender.IsValid("CARDIOLOGY"));
            Assert.True(Gender.IsValid("ORTHOPEDICS"));
            Assert.True(Gender.IsValid("ANAESTHESIOLOGY"));
            Assert.True(Gender.IsValid("NEUROLOGY"));
            Assert.True(Gender.IsValid("ONCOLOGY"));
            Assert.True(Gender.IsValid("GYNECOLOGY"));
            Assert.True(Gender.IsValid("OBSTETRICS"));
            Assert.True(Gender.IsValid("RADIOLOGY"));
            Assert.True(Gender.IsValid("UROLOGY"));
        }
        
    }
}