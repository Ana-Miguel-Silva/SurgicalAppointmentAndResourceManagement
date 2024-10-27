using System;
using System.Collections.Generic;
using Moq;
using Xunit;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Tests.Domain.Staffs
{
    public class StaffTests
    {
        [Fact]
        public void WhenInstantiatingStaff_WithValidParameters_ThenIsCreatedSuccessfully()
        {
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

            var Staff = new StaffProfile(name, email, phone, role, specialization, slots, staffID);

            Assert.NotNull(Staff);
            Assert.Equal(name, Staff.Name);
            Assert.Equal(email, Staff.Email);
            Assert.Equal(phone, Staff.PhoneNumber);
            Assert.Equal(role, Staff.Role);
            Assert.Equal(specialization, Staff.Specialization);
            Assert.Equal(slots, Staff.AvailabilitySlots);
            Assert.Equal(staffID, Staff.StaffId);
            Assert.True(Staff.Active);
        }

        [Fact]
        public void WhenInstantiatingStaff_WithNullParameters_ThenThrowsException()
        {
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

            Assert.Throws<BusinessRuleValidationException>(() => new StaffProfile(null, email, phone, role, specialization, slots, staffID));
            Assert.Throws<BusinessRuleValidationException>(() => new StaffProfile(name, null, phone, role, specialization, slots, staffID));
            Assert.Throws<BusinessRuleValidationException>(() => new StaffProfile(name, email, null, role, specialization, slots, staffID));
            Assert.Throws<BusinessRuleValidationException>(() => new StaffProfile(name, email, phone, null, specialization, slots, staffID));
            Assert.Throws<BusinessRuleValidationException>(() => new StaffProfile(name, email, phone, role, null, slots, staffID));
            Assert.Throws<BusinessRuleValidationException>(() => new StaffProfile(name, email, phone, role, specialization, null, staffID));
            Assert.Throws<BusinessRuleValidationException>(() => new StaffProfile(name, email, phone, role, specialization, slots, null));
        }

        [Fact]
        public void WhenChangingEmail_OnActiveStaff_ThenUpdatesSuccessfully()
        {
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

            var Staff = new StaffProfile(name, email, phone, role, specialization, slots, staffID);
            var newEmail = new Email("1221137@isep.ipp.pt");
            Staff.ChangeEmail(newEmail);


            Assert.Equal(newEmail, Staff.Email);
        }

        [Fact]
        public void WhenChangingEmail_OnInactiveStaff_ThenThrowsException()
        {
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

            var Staff = new StaffProfile(name, email, phone, role, specialization, slots, staffID);
            Staff.MarkAsInative();
            
            var newEmail = new Email("1221137@isep.ipp.pt");

            Assert.Throws<BusinessRuleValidationException>(() => Staff.ChangeEmail(newEmail));
        }
        [Fact]
        public void WhenChangingEmail_toNull_ThenThrowsException()
        {
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

            var Staff = new StaffProfile(name, email, phone, role, specialization, slots, staffID);

            Assert.Throws<BusinessRuleValidationException>(() => Staff.ChangeEmail(null));
        }

        [Fact]
        public void WhenChangingPhone_OnActiveStaff_ThenUpdatesSuccessfully()
        {
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

            var Staff = new StaffProfile(name, email, phone, role, specialization, slots, staffID);
            var newPhone = new PhoneNumber("918273645");
            Staff.ChangePhone(newPhone);


            Assert.Equal(newPhone, Staff.PhoneNumber);
        }

        [Fact]
        public void WhenChangingPhone_OnInactiveStaff_ThenThrowsException()
        {
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

            var Staff = new StaffProfile(name, email, phone, role, specialization, slots, staffID);
            Staff.MarkAsInative();
            
            var newPhone = new PhoneNumber("918273645");

            Assert.Throws<BusinessRuleValidationException>(() => Staff.ChangePhone(newPhone));
        }
        [Fact]
        public void WhenChangingPhone_toNull_ThenThrowsException()
        {
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

            var Staff = new StaffProfile(name, email, phone, role, specialization, slots, staffID);

            Assert.Throws<BusinessRuleValidationException>(() => Staff.ChangePhone(null));
        }

        [Fact]
        public void WhenChangingLicense_OnActiveStaff_ThenUpdatesSuccessfully()
        {
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

            var Staff = new StaffProfile(name, email, phone, role, specialization, slots, staffID);
            var newLicense ="918273645";
            Staff.ChangeLicenseNumber(newLicense);


            Assert.Equal(newLicense, Staff.LicenseNumber);
        }

        [Fact]
        public void WhenChangingLicense_OnInactiveStaff_ThenThrowsException()
        {
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

            var Staff = new StaffProfile(name, email, phone, role, specialization, slots, staffID);
            Staff.MarkAsInative();

            var newLicense ="918273645";

            Assert.Throws<BusinessRuleValidationException>(() => Staff.ChangeLicenseNumber(newLicense));
        }
        [Fact]
        public void WhenChangingLicense_toNull_ThenThrowsException()
        {
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

            var Staff = new StaffProfile(name, email, phone, role, specialization, slots, staffID);

            Assert.Throws<BusinessRuleValidationException>(() => Staff.ChangeLicenseNumber(null));
        }

        [Fact]
        public void WhenChangingSpecialization_OnActiveStaff_ThenUpdatesSuccessfully()
        {
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

            var Staff = new StaffProfile(name, email, phone, role, specialization, slots, staffID);
            var newSpecialization ="PEDIATRICS";
            Staff.UpdateSpecialization(newSpecialization);


            Assert.Equal(newSpecialization, Staff.Specialization);
        }

        [Fact]
        public void WhenChangingSpecialization_OnInactiveStaff_ThenThrowsException()
        {
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

            var Staff = new StaffProfile(name, email, phone, role, specialization, slots, staffID);
            Staff.MarkAsInative();

            var newSpecialization ="PEDIATRICS";

            Assert.Throws<BusinessRuleValidationException>(() => Staff.UpdateSpecialization(newSpecialization));
        }
        [Fact]
        public void WhenChangingSpecialization_toNull_ThenThrowsException()
        {
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

            var Staff = new StaffProfile(name, email, phone, role, specialization, slots, staffID);

            Assert.Throws<BusinessRuleValidationException>(() => Staff.UpdateSpecialization(null));
        }
        [Fact]
        public void WhenMarkAsInactive_NotThrowError()
        {
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

            var Staff = new StaffProfile(name, email, phone, role, specialization, slots, staffID);
            Staff.MarkAsInative();
            Assert.NotNull(Staff);
            Assert.False(Staff.Active);
        }
    }
}