using System;
using System.Collections.Generic;
using Xunit;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Patients;

namespace Domain.Tests
{
    public class PatientDtoTests
    {
        [Fact]
        public void Constructor_InitializesProperties_WhenValidParameters()
        {
            // Arrange
            var id = Guid.NewGuid();
            var name = "John  Doe";
            var medicalRecordNumber = new MedicalRecordNumber();
            var dateOfBirth = new DateTime(1990, 1, 1);
            var phone = new PhoneNumber("123456789");
            var email = new Email("john.doe@example.com");
            var userEmail = new Email("john.doe.user@example.com");
            var nameEmergency = "Jane Doe";
            var phoneEmergency = new PhoneNumber("987654321");
            var emailEmergency = new Email("jane.doe@example.com");
            var gender = "Male";
 
            var appointmentHistory = new List<string> { "Checkup", "Follow-up" };
            var active = true;


            // Act
            var patientDto = new PatientDto(id, name, medicalRecordNumber, dateOfBirth, phone, email, userEmail, 
                                             nameEmergency, phoneEmergency, emailEmergency, gender,  appointmentHistory, active);

            // Assert
            Assert.Equal(id, patientDto.Id);
            Assert.Equal(name, patientDto.name.GetFullName()); // Assuming FullName has a FullNameValue property
            Assert.Equal(medicalRecordNumber, patientDto.medicalRecordNumber);
            Assert.Equal(dateOfBirth, patientDto.DateOfBirth);
            Assert.Equal(phone, patientDto.Phone);
            Assert.Equal(email, patientDto.Email);
            Assert.Equal(userEmail, patientDto.UserEmail);
            Assert.Equal(nameEmergency, patientDto.nameEmergency);
            Assert.Equal(phoneEmergency, patientDto.phoneEmergency);
            Assert.Equal(emailEmergency, patientDto.emailEmergency);
            Assert.Equal(gender, patientDto.gender);
            Assert.Equal(appointmentHistory, patientDto.AppointmentHistory);
        }

        

    }
}
