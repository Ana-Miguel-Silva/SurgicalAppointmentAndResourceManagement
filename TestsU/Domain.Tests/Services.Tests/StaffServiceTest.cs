using Xunit;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.ApplicationService.Staff;
using Microsoft.Extensions.Configuration;
using DDDSample1.Infrastructure.Staff;
using DDDSample1.Domain.Users;

namespace Backend.Tests.Services
{
    public class PatientsServiceTest
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IStaffRepository> _staffRepositoryMock;
        private readonly Mock<IMailService> _emailServiceMock;
        private readonly StaffService _StaffService;

        public StaffServiceTest()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _staffRepositoryMock = new Mock<IStaffRepository>();            
            _emailServiceMock = new Mock<IMailService>();

            _StaffService = new StaffService(
                _unitOfWorkMock.Object,
                _emailServiceMock.Object,
                _staffRepositoryMock.Object
            );
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnStaffDTOList()
        {
            // Arrange
            var StaffProfiles = new List<StaffProfile>
            {
                 new StaffProfile(
                    name: new FullName("Ivo Gerald Robotnik"),
                    phone: new PhoneNumber("987654322"), 
                    email: new Email("1221148@isep.ipp.pt"),
                    role: "DOCTOR",
                    specialization: "CARDIOLOGY",
                    slots: new List<Slot> { new("20/10/2024 10:00","20/10/2024 10:15") },
                    ID: "D20240"                      
                )
            };

            _staffRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(StaffProfiles);

            // Act
            var result = await _StaffService.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StaffProfiles.Count, result.Count);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnStaffDTO()
        {
            // Arrange
          var staffProfile = new StaffProfile(
                    name: new FullName("Ivo Gerald Robotnik"),
                    phone: new PhoneNumber("987654322"), 
                    email: new Email("1221148@isep.ipp.pt"),
                    role: "DOCTOR",
                    specialization: "CARDIOLOGY",
                    slots: new List<Slot> { new("20/10/2024 10:00","20/10/2024 10:15") },
                    ID: "D20240"                 
                );
            var StaffID = staffProfile.StaffId;

            _staffRepositoryMock.Setup(repo => repo.GetByStaffIDAsync(StaffID)).ReturnsAsync(staffProfile);

            // Act
            var result = await _StaffService.GetByStaffIDAsync(StaffID);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StaffID, result.StaffId);
        }

        [Fact]
        public async Task AddAsync_ShouldReturnStaffDTO()
        {
            // Arrange
            var dto = new CreatingStaffDto(
                    name : "Ivo Gerald Robotnik",
                    email : "1221148@isep.ipp.pt",
                    phone : "987654322",
                    role : "DOCTOR",
                    specialization : "CARDIOLOGY",
                    slots : new List<DateDTO>
                    {
                        new DateDTO("20/10/2024 10:00", "20/10/2024 10:15")
                    }      
                );

            var user = new User("user", new Email("user@example.com"), "ADMIN");

            var expectedPatient = new StaffProfile(
                    name: new FullName("Ivo Gerald Robotnik"),
                    phone: new PhoneNumber("987654322"), 
                    email: new Email("1221148@isep.ipp.pt"),
                    role: "DOCTOR",
                    specialization: "CARDIOLOGY",
                    slots: new List<Slot> { new("20/10/2024 10:00","20/10/2024 10:15") },
                    ID: "D20240"                       
                );

            _staffRepositoryMock.Setup(repo => repo.AddAsync(It.IsAny<StaffProfile>()))
                .ReturnsAsync(expectedPatient);

            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0)); // Fix: Change Task.CompletedTask to Task.FromResult(0)

            // Act
            var result = await _StaffService.AddAsync(dto);

            // Assert
            Assert.NotNull(result);
            
        }


        [Fact]
        public async Task UpdateAsync_ShouldReturnUpdatedStaffDTO()
        {
            // Arrange
            var id =  "D20240";
            var dto = new UpdateStaffDto(
                    phone: "987651122", 
                    email: "1221137@isep.ipp.pt",
                    specialization: "PEDIATRICS"
                );

            var Staff = new StaffProfile(
                    name: new FullName("Ivo Gerald Robotnik"),
                    phone: new PhoneNumber("987654322"), 
                    email: new Email("1221148@isep.ipp.pt"),
                    role: "DOCTOR",
                    specialization: "CARDIOLOGY",
                    slots: new List<Slot> { new("20/10/2024 10:00","20/10/2024 10:15") },
                    ID: "D20240"                 
                );

            _staffRepositoryMock.Setup(repo => repo.GetByStaffIDAsync("D2024")).ReturnsAsync(Staff);
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0));

            // Act
            var result = await _StaffService.UpdateAsync(Staff.StaffId, dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.Email, result.Email.FullEmail);
        }

        [Fact]
        public async Task InactivateAsync_ShouldReturnInactivatedStaffDTO()
        {
            // Arrange
            var Staff = new StaffProfile(
                    name: new FullName("Ivo Gerald Robotnik"),
                    phone: new PhoneNumber("987654322"), 
                    email: new Email("1221148@isep.ipp.pt"),
                    role: "DOCTOR",
                    specialization: "CARDIOLOGY",
                    slots: new List<Slot> { new("20/10/2024 10:00","20/10/2024 10:15") },
                    ID: "D20240"                     
                );
            var StaffId = Staff.StaffId;

            _staffRepositoryMock.Setup(repo => repo.GetByStaffIDAsync(StaffId)).ReturnsAsync(Staff);
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0)); // Fix: Change Task.CompletedTask to Task.FromResult(0)

            // Act
            var result = await _StaffService.InactivateAsync(StaffId);

            // Assert
            Assert.NotNull(result);
            Assert.False(Staff.Active);
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnDeletedStaffDTO()
        {
            // Arrange
            var Staff = new StaffProfile(
                    name: new FullName("Ivo Gerald Robotnik"),
                    phone: new PhoneNumber("987654322"), 
                    email: new Email("1221148@isep.ipp.pt"),
                    role: "DOCTOR",
                    specialization: "CARDIOLOGY",
                    slots: new List<Slot> { new("20/10/2024 10:00","20/10/2024 10:15") },
                    ID: "D20240"                    
            );
            Staff.MarkAsInative();
            var StaffId = Staff.StaffId;

            _staffRepositoryMock.Setup(repo => repo.GetByStaffIDAsync(StaffId)).ReturnsAsync(Staff);
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0)); // Fix: Change Task.CompletedTask to Task.FromResult(0)

            // Act
            var result = await _StaffService.DeleteAsync(StaffId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(StaffId, result.StaffId);
        }
    }
}