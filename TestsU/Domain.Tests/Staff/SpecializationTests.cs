using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Shared;
using System;
using System.Collections.Generic;
using Xunit;

namespace Domain.Tests
{
    public class SpecializationTests
    {

        [Fact]
        public void ValidSpecializations()
        {
            Assert.True(Specialization.IsValid("PEDIATRICS"));
            Assert.True(Specialization.IsValid("SURGERY"));
            Assert.True(Specialization.IsValid("CARDIOLOGY"));
            Assert.True(Specialization.IsValid("ORTHOPEDICS"));
            Assert.True(Specialization.IsValid("ANAESTHESIOLOGY"));
            Assert.True(Specialization.IsValid("NEUROLOGY"));
            Assert.True(Specialization.IsValid("ONCOLOGY"));
            Assert.True(Specialization.IsValid("GYNECOLOGY"));
            Assert.True(Specialization.IsValid("OBSTETRICS"));
            Assert.True(Specialization.IsValid("RADIOLOGY"));
            Assert.True(Specialization.IsValid("UROLOGY"));
        }
        public void InvalidSpecializations()
        {
            Assert.False(Specialization.IsValid("ADMIN"));
            Assert.False(Specialization.IsValid("DOCTOR"));
            Assert.False(Specialization.IsValid("NURSE"));
            Assert.False(Specialization.IsValid("TECHNICIAN"));
            Assert.False(Specialization.IsValid("PATIENT"));

        }
        
    }
}