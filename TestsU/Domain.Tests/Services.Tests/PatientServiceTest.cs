using Xunit;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.ApplicationService.Patients;
using Microsoft.Extensions.Configuration;
using DDDSample1.Infrastructure.Patients;
using DDDSample1.Domain.Users;

namespace Backend.Tests.Services
{
    public class PatientsServiceTest
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IPatientRepository> _patientRepositoryMock;
        private readonly Mock<IMailService> _emailServiceMock;
        private readonly PatientService _PatientService;

        public PatientsServiceTest()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _patientRepositoryMock = new Mock<IPatientRepository>();            
            _emailServiceMock = new Mock<IMailService>();

            _PatientService = new PatientService(
                _unitOfWorkMock.Object,
                _emailServiceMock.Object,
                _patientRepositoryMock.Object
            );
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnPatientDTOList()
        {
            // Arrange
            var Patients = new List<Patient>
            {
                 new Patient(
                    name: "Patient Teste",
                    dateOfBirth: DateTime.Now.AddYears(-30), // Set a sample birth date
                    phone: new PhoneNumber("988652872"), 
                    email: new Email("test@example.com"),
                    userEmail: new Email("user@example.com"),
                    nameEmergency: "John Doe",
                    phoneEmergency: new PhoneNumber("966652872"),
                    emailEmergency: new Email("emergency@example.com"),
                    gender: "Male",
                    Allergies: new List<string> { "Peanuts" },
                    AppointmentHistory: new List<string> { "2024-10-24" }                   
                )
            };

            _patientRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(Patients);

            // Act
            var result = await _PatientService.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(Patients.Count, result.Count);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnPatientDTO()
        {
            // Arrange
          var patient = new Patient(
                    name: "Patient Teste",
                    dateOfBirth: DateTime.Now.AddYears(-30), // Set a sample birth date
                    phone: new PhoneNumber("988652872"), 
                    email: new Email("test@example.com"),
                    userEmail: new Email("user@example.com"),
                    nameEmergency: "John Doe",
                    phoneEmergency: new PhoneNumber("966652872"),
                    emailEmergency: new Email("emergency@example.com"),
                    gender: "Male",
                    Allergies: new List<string> { "Peanuts" },
                    AppointmentHistory: new List<string> { "" }                   
                );
            var PatientId = patient.Id;

            _patientRepositoryMock.Setup(repo => repo.GetByIdAsync(PatientId)).ReturnsAsync(patient);

            // Act
            var result = await _PatientService.GetByIdAsync(PatientId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(PatientId.AsGuid(), result.Id);
        }

        [Fact]
        public async Task AddAsync_ShouldReturnPatientDTO()
        {
            // Arrange
            var dto = new CreatingPatientDto(
                    name1: "Patient Teste",                                  
                    dateOfBirth: DateTime.Now.AddYears(-30), 
                    phoneNumberObject: "988652872", 
                    emailObject: "test@example.com",
                    emailUserObject: "user@example.com",
                    gender: "Male"             
                );

            var user = new User("user", new Email("user@example.com"), "ADMIN");

            var expectedPatient = new Patient(
                    name: "Patient Teste",
                    dateOfBirth: DateTime.Now.AddYears(-30), // Set a sample birth date
                    phone: new PhoneNumber("988652872"), 
                    email: new Email("test@example.com"),
                    userEmail: new Email("user@example.com"),
                    nameEmergency: "John Doe",
                    phoneEmergency: new PhoneNumber("966652872"),
                    emailEmergency: new Email("emergency@example.com"),
                    gender: "Male",
                    Allergies: new List<string> { "Peanuts" },
                    AppointmentHistory: new List<string> { "" }                   
                );

            _patientRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<Patient>()))
                .ReturnsAsync(expectedPatient);

            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0)); // Fix: Change Task.CompletedTask to Task.FromResult(0)

            // Act
            var result = await _PatientService.AddAsync(dto, user);

            // Assert
            Assert.NotNull(result);
            
        }


        [Fact]
        public async Task UpdateAsync_ShouldReturnUpdatedPatientDTO()
        {
            // Arrange
            var id =  new PatientId(Guid.NewGuid());
            var dto = new PatientDto(
                    id.AsGuid(),
                    name: "Patient Teste",
                    new MedicalRecordNumber(),
                    dateOfBirth: DateTime.Now.AddYears(-30), // Set a sample birth date
                    phone: new PhoneNumber("988652872"), 
                    email: new Email("test@example.com"),
                    userEmail: new Email("user@example.com"),
                    nameEmergency: "John Doe",
                    phoneEmergency: new PhoneNumber("966652872"),
                    emailEmergency: new Email("emergency@example.com"),
                    gender: "Male",
                    Allergies: new List<string> { "Peanuts" },
                    AppointmentHistory: new List<string> { "" }                   
                );

            var Patient = new Patient(
                    name: "Patient Teste",
                    dateOfBirth: DateTime.Now.AddYears(-30), // Set a sample birth date
                    phone: new PhoneNumber("988652872"), 
                    email: new Email("test@example.com"),
                    userEmail: new Email("user@example.com"),
                    nameEmergency: "John Doe",
                    phoneEmergency: new PhoneNumber("966652872"),
                    emailEmergency: new Email("emergency@example.com"),
                    gender: "Male",
                    Allergies: new List<string> { "Peanuts" },
                    AppointmentHistory: new List<string> { "" }                   
                );

            _patientRepositoryMock.Setup(repo => repo.GetByEmailAsync("test@example.com")).ReturnsAsync(Patient);
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0));

            // Act
            var result = await _PatientService.UpdateAsync(dto, "test@example.com");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.Email.FullEmail, result.Email.FullEmail);
        }

        [Fact]
        public async Task InactivateAsync_ShouldReturnInactivatedPatientDTO()
        {
            // Arrange
            var Patient = new Patient(
                    name: "Patient Teste",
                    dateOfBirth: DateTime.Now.AddYears(-30), // Set a sample birth date
                    phone: new PhoneNumber("988652872"), 
                    email: new Email("test@example.com"),
                    userEmail: new Email("user@example.com"),
                    nameEmergency: "John Doe",
                    phoneEmergency: new PhoneNumber("966652872"),
                    emailEmergency: new Email("emergency@example.com"),
                    gender: "Male",
                    Allergies: new List<string> { "Peanuts" },
                    AppointmentHistory: new List<string> { "" }                   
                );
            var PatientId = Patient.Id;

            _patientRepositoryMock.Setup(repo => repo.GetByIdAsync(PatientId)).ReturnsAsync(Patient);
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0)); // Fix: Change Task.CompletedTask to Task.FromResult(0)

            // Act
            var result = await _PatientService.InactivateAsync(PatientId);

            // Assert
            Assert.NotNull(result);
            Assert.False(Patient.Active);
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnDeletedPatientDTO()
        {
            // Arrange
            var Patient = new Patient(
                name: "Patient Teste",
                dateOfBirth: DateTime.Now.AddYears(-30), // Set a sample birth date
                phone: new PhoneNumber("988652872"), 
                email: new Email("test@example.com"),
                userEmail: new Email("user@example.com"),
                nameEmergency: "John Doe",
                phoneEmergency: new PhoneNumber("966652872"),
                emailEmergency: new Email("emergency@example.com"),
                gender: "Male",
                Allergies: new List<string> { "Peanuts" },
                AppointmentHistory: new List<string> { "" }                   
            );
            Patient.Deactivate();
            var PatientId = Patient.Id;

            _patientRepositoryMock.Setup(repo => repo.GetByIdAsync(PatientId)).ReturnsAsync(Patient);
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0)); // Fix: Change Task.CompletedTask to Task.FromResult(0)

            // Act
            var result = await _PatientService.DeleteAsync(PatientId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(PatientId.AsGuid(), result.Id);
        }
    }
}