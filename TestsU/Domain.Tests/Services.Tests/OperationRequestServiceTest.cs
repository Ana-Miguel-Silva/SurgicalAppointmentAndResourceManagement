using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Patients;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Domain.Shared;
using DDDSample1.ApplicationService.OperationRequests;

namespace DDDSample1.Tests
{
    public class OperationRequestServiceTests
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IOperationRequestRepository> _repoMock;
        private readonly Mock<IPatientRepository> _patientRepoMock;
        private readonly Mock<IStaffRepository> _staffRepoMock;
        private readonly Mock<IOperationTypeRepository> _operationTypeRepoMock;
        private readonly OperationRequestService _service;

        public OperationRequestServiceTests()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _repoMock = new Mock<IOperationRequestRepository>();
            _patientRepoMock = new Mock<IPatientRepository>();
            _staffRepoMock = new Mock<IStaffRepository>();
            _operationTypeRepoMock = new Mock<IOperationTypeRepository>();
            _service = new OperationRequestService(
                _unitOfWorkMock.Object,
                _repoMock.Object,
                _patientRepoMock.Object,
                _staffRepoMock.Object,
                _operationTypeRepoMock.Object
            );
        }

        [Fact]
        public async Task AddAsync_ShouldReturnOperationRequestDto_WhenValidDataIsProvided()
        {
            var dto = new CreatingOperationRequestUIDto(
                "test@example.com",
                "Surgery",
                DateTime.Now.AddDays(1),
                "URGENT"
            );

            var patient = new Patient("John Doe", DateTime.Now.AddYears(-30), new PhoneNumber("123456789"), new Email("test@example.com"), new Email("user@example.com"), "Emergency", new PhoneNumber("987654321"), new Email("emergency@example.com"), "Male", new List<string>());
            var doctor = new StaffProfile(new FullName("Dr. John Doe"), new Email("doctor@example.com"), new PhoneNumber("123456789"), "SURGEON", "SURGEON", new List<Slot>(), "Doc123");
            var requiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(1,"SURGEON", "SURGEON")
            };
            var operationType = new OperationType("Surgery", requiredStaff, new EstimatedDuration(new TimeOnly(1, 0, 0), new TimeOnly(2, 0, 0), new TimeOnly(3, 0, 0)));

            _patientRepoMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync(patient);
            _staffRepoMock.Setup(r => r.GetByUsernameAsync(It.IsAny<string>())).ReturnsAsync(new List<StaffProfile> { doctor });
            _operationTypeRepoMock.Setup(r => r.GetByNameAsync(It.IsAny<string>())).ReturnsAsync(new List<OperationType> { operationType });

            var patientId = patient.Id;
            var staffGuid = doctor.Id;
            var operationTypeId = operationType.Id;
            var deadline = DateTime.Now.AddDays(1);
            var priority = "URGENT";

            _repoMock.Setup(r => r.AddAsync(It.IsAny<OperationRequest>())).ReturnsAsync(new OperationRequest(
                patientId,
                staffGuid,
                operationTypeId,
                deadline,
                priority
            ));

            _unitOfWorkMock.Setup(u => u.CommitAsync()).ReturnsAsync(1);

            var result = await _service.AddAsync(dto, "doctor@example.com");

            Assert.NotNull(result);
            Assert.Equal(patientId, result.MedicalRecordNumber);
            Assert.Equal(staffGuid, result.DoctorId);
            Assert.Equal(operationTypeId, result.OperationTypeId);
            Assert.Equal(deadline.Date, result.Deadline.Date);
            Assert.Equal(priority, result.Priority);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateOperationRequest_WhenValidDataIsProvided()
        {
            var operationRequestId = Guid.NewGuid();
            var dto = new UpdateOperationRequestDto(
                operationRequestId,
                DateTime.Now.AddDays(2),
                "ELECTIVE"
            );

            var patient = new Patient("John Doe", DateTime.Now.AddYears(-30), new PhoneNumber("123456789"), new Email("test@example.com"), new Email("user@example.com"), "Emergency", new PhoneNumber("987654321"), new Email("emergency@example.com"), "Male", new List<string>());
            var doctor = new StaffProfile(new FullName("Dr. John Doe"), new Email("doctor@example.com"), new PhoneNumber("123456789"), "SURGEON", "SURGEON", new List<Slot>(), "Doc123");
            var requiredStaff = new List<RequiredStaff>
            {
                new RequiredStaff(1,"SURGEON", "SURGEON")
            };
            var operationType = new OperationType("Surgery", requiredStaff, new EstimatedDuration(new TimeOnly(1, 0, 0), new TimeOnly(2, 0, 0), new TimeOnly(3, 0, 0)));

            _patientRepoMock.Setup(r => r.GetByEmailAsync(It.IsAny<string>())).ReturnsAsync(patient);
            _staffRepoMock.Setup(r => r.GetByUsernameAsync(It.IsAny<string>())).ReturnsAsync(new List<StaffProfile> { doctor });
            _operationTypeRepoMock.Setup(r => r.GetByNameAsync(It.IsAny<string>())).ReturnsAsync(new List<OperationType> { operationType });

            var operationRequest = new OperationRequest(
                patient.Id,
                doctor.Id,
                operationType.Id,
                DateTime.Now.AddDays(1),
                "URGENT"
            );

            _repoMock.Setup(r => r.GetByIdAsync(It.IsAny<OperationRequestId>())).ReturnsAsync(operationRequest);
            _repoMock.Setup(r => r.AddAsync(It.IsAny<OperationRequest>())).ReturnsAsync(operationRequest);

            var result = await _service.UpdateAsync(dto, "doctor@example.com");

            Assert.NotNull(result);
            Assert.Equal(DateTime.Now.AddDays(2).Date, result.Deadline.Date);
            Assert.Equal("ELECTIVE", result.Priority);
        }

        [Fact]
        public async Task DeleteAsync_ShouldDeleteOperationRequest_WhenValidIdIsProvided()
        {
            var operationRequestId = new OperationRequestId(Guid.NewGuid());

            _repoMock.Setup(r => r.GetByIdAsync(It.IsAny<OperationRequestId>()))
                     .ReturnsAsync(new OperationRequest(
                         new PatientId(Guid.NewGuid()),
                         new StaffGuid(Guid.NewGuid()),
                         new OperationTypeId(Guid.NewGuid()),
                         DateTime.Now,
                         "URGENT"
                     ));

            _repoMock.Setup(r => r.Remove(It.IsAny<OperationRequest>())).Callback<OperationRequest>(x => { });

            await _service.DeleteAsync(operationRequestId);

            _repoMock.Verify(r => r.Remove(It.IsAny<OperationRequest>()), Times.Once);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnOperationRequest_WhenValidIdIsProvided()
        {
            var operationRequestId = new OperationRequestId(Guid.NewGuid());

            var operationRequest = new OperationRequest(
                new PatientId(Guid.NewGuid()),
                new StaffGuid(Guid.NewGuid()),
                new OperationTypeId(Guid.NewGuid()),
                DateTime.Now,
                "URGENT"
            );

            _repoMock.Setup(r => r.GetByIdAsync(It.IsAny<OperationRequestId>())).ReturnsAsync(operationRequest);

            var result = await _service.GetByIdAsync(operationRequestId);

            Assert.NotNull(result);
        }
    }
}
