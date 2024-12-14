using System;
using System.Collections.Generic;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Shared;
using Xunit;

namespace Domain.Tests
{
    public class PatientTests
    {
        [Fact]
        public void Constructor_InitializesProperties_WhenValidParameters()
        {
            var name = "John  Doe";
            var dateOfBirth = new DateTime(1990, 1, 1);
            var phone = new PhoneNumber("123456789");
            var email = new Email("john.doe@example.com");
            var userEmail = new Email("john.doe.user@example.com");
            var gender = "Male";

            var appointmentHistory = new List<string> { "2024-01-01", "2024-02-01" };
            var emergencyName = "Jane Doe";
            var emergencyPhone = new PhoneNumber("987654321");
            var emergencyEmail = new Email("jane.doe@example.com");

            var patient = new Patient(name, dateOfBirth, phone, email, userEmail, emergencyName, emergencyPhone, emergencyEmail, gender,  appointmentHistory);

            Assert.Equal(name, patient.name.GetFullName());
            Assert.Equal(dateOfBirth, patient.DateOfBirth);
            Assert.Equal(phone, patient.Phone);
            Assert.Equal(email, patient.Email);
            Assert.Equal(userEmail, patient.UserEmail);
            Assert.Equal(gender, patient.gender);

            Assert.Equal(appointmentHistory, patient.AppointmentHistory);
            Assert.Equal(emergencyName, patient.nameEmergency);
            Assert.Equal(emergencyPhone, patient.phoneEmergency);
            Assert.Equal(emergencyEmail, patient.emailEmergency);
            Assert.True(patient.Active);
            Assert.Null(patient.ExpirationDate);
        }

        
        [Fact]
        public void ChangeName_UpdatesName_WhenCalled()
        {
            var patient = new Patient("John Doe", DateTime.Now, new PhoneNumber("123456789"), new Email("email@example.com"), new Email("user@example.com"), "Emergency", new PhoneNumber("987654321"), new Email("emergency@example.com"), "Male", new List<string>());
            var newName = new FullName("Jane Doe");

            patient.ChangeName(newName);

            Assert.Equal(newName, patient.name);
        }

        [Fact]
        public void ChangeEmail_UpdatesEmail_WhenCalled()
        {
            var patient = new Patient("John Doe", DateTime.Now, new PhoneNumber("123456789"), new Email("email@example.com"), new Email("user@example.com"), "Emergency", new PhoneNumber("987654321"), new Email("emergency@example.com"), "Male", new List<string>());
            var newEmail = new Email("new.email@example.com");

            patient.ChangeEmail(newEmail);

            Assert.Equal(newEmail, patient.Email);
        }

        [Fact]
        public void Deactivate_UpdatesActiveStatus_WhenCalled()
        {
            var patient = new Patient("John Doe", DateTime.Now, new PhoneNumber("123456789"), new Email("email@example.com"), new Email("user@example.com"), "Emergency", new PhoneNumber("987654321"), new Email("emergency@example.com"), "Male", new List<string>());

            patient.Deactivate();

            Assert.False(patient.Active);
            Assert.NotNull(patient.ExpirationDate);
            Assert.True(patient.ExpirationDate > DateTime.Now);
        }

        
    }
}
