using Xunit;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.Specializations;
using DDDSample1.ApplicationService.Staff;
using Microsoft.Extensions.Configuration;
using DDDSample1.Infrastructure.Staff;
using DDDSample1.Domain.Users;

namespace Backend.Tests.Services
{
    public class StaffServiceTest
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IStaffRepository> _staffRepositoryMock;
        private readonly Mock<IMailService> _emailServiceMock;

        private readonly Mock<ISpecializationRepository> _specializationRepositoryMock;
        private readonly StaffService _StaffService;

        public StaffServiceTest()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _staffRepositoryMock = new Mock<IStaffRepository>();            
            _emailServiceMock = new Mock<IMailService>();
            _specializationRepositoryMock = new Mock<ISpecializationRepository>();

            _StaffService = new StaffService(
                _unitOfWorkMock.Object,
                _staffRepositoryMock.Object,
                _specializationRepositoryMock.Object
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