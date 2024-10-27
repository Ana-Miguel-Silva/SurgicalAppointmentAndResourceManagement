using Xunit;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.Users;
using DDDSample1.ApplicationService.Users;
using Microsoft.Extensions.Options;

namespace Backend.Tests.Services
{
    public class UserServiceTest
    {
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly Mock<IMailService> _emailServiceMock;
        private readonly UserService _userService;

        private readonly JwtSettings _jwtSettings;

        public UserServiceTest()
        {
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _userRepositoryMock = new Mock<IUserRepository>();
            _emailServiceMock = new Mock<IMailService>();

            _jwtSettings = new JwtSettings { TokenExpiryInMinutes = 60 }; // Set a sample JWT setting
            var optionsMock = new Mock<IOptions<JwtSettings>>();
            optionsMock.Setup(x => x.Value).Returns(_jwtSettings);

            _userService = new UserService(
                _unitOfWorkMock.Object,
                _userRepositoryMock.Object,
                _emailServiceMock.Object,
                optionsMock.Object
            );
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnUserDtoList()
        {
            // Arrange
            var users = new List<User>
            {
                new User("testUser", new Email("test@example.com"), "ADMIN")
            };

            _userRepositoryMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(users);

            // Act
            var result = await _userService.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            Assert.Equal(users[0].Username, result[0].Username);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnUserDto()
        {
            // Arrange
            var userId = new UserId(Guid.NewGuid());
            var user = new User("testUser", new Email("test@example.com"), "ADMIN") ;

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(userId)).ReturnsAsync(user);

            // Act
            var result = await _userService.GetByIdAsync(userId);

            // Assert
            Assert.NotNull(result);
            
        }

        [Fact]
        public async Task AddAsync_ShouldReturnUserDto()
        {
            // Arrange
            var dto = new CreatingUserDto
            (
                 "newUser",
                 "newuser@example.com",
                 "ADMIN"
            );

            var user = new User(dto.Username, new Email(dto.Email), dto.Role);
            _userRepositoryMock.Setup(repo => repo.AddAsync(user)).ReturnsAsync(user);
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0));

            // Act
            var result = await _userService.AddAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(user.Username, result.Username);
            Assert.Equal(user.Email.FullEmail, result.Email.FullEmail);
        }

        [Fact]
        public async Task UpdatePassword_ShouldUpdateUserPassword()
        {
            // Arrange
            var username = "testUser";
            var newPassword = "#Password0";

            var user = new User(username, new Email("test@example.com"), "ADMIN");
            _userRepositoryMock.Setup(repo => repo.GetByUsernameAsync(username)).ReturnsAsync(new List<User> { user });
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0));

            // Act
            await _userService.UpdatePassword(username, newPassword);

            // Assert
            Assert.True(user.CheckPassword(newPassword)); // Ensure the password was set
        }

        [Fact]
        public async Task Login_ShouldReturnUserDto_WhenCredentialsAreValid()
        {
            // Arrange
            var username = "testUser";
            var password = "#Password0";
            var user = new User(username, new Email("test@example.com"), "ADMIN");
            user.SetPassword(password);

            _userRepositoryMock.Setup(repo => repo.GetByUsernameAsync(username)).ReturnsAsync(new List<User> { user });
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0));

            // Act
            var result = await _userService.Login(username, password);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(user.Username, result.Username);
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnUpdatedUserDto()
        {
            // Arrange
            var userId = new UserId(Guid.NewGuid());
            var user = new User("oldUser", new Email("old@example.com"), "ADMIN") ;

            var dto = new UserDto(userId.AsGuid(), "newUser", new Email("new@example.com"), "ADMIN");

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(userId)).ReturnsAsync(user);
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0));

            // Act
            var result = await _userService.UpdateAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.Email.FullEmail, result.Email.FullEmail);
            Assert.Equal(dto.Username, result.Username);
        }

        [Fact]
        public async Task InactivateAsync_ShouldReturnInactivatedUserDto()
        {
            // Arrange
            var userId = new UserId(Guid.NewGuid());
            var user = new User("testUser", new Email("test@example.com"), "ADMIN") ;

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(userId)).ReturnsAsync(user);
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0));

            // Act
            var result = await _userService.InactivateAsync(userId);

            // Assert
            Assert.NotNull(result);
            Assert.False(user.Active); 
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnDeletedUserDto()
        {
            // Arrange
            var userId = new UserId(Guid.NewGuid());
            var user = new User("testUser", new Email("test@example.com"), "ADMIN") ;
            user.MarkAsInative(); 

            _userRepositoryMock.Setup(repo => repo.GetByIdAsync(userId)).ReturnsAsync(user);
            _userRepositoryMock.Setup(repo => repo.Remove(user));
            _unitOfWorkMock.Setup(uow => uow.CommitAsync()).Returns(Task.FromResult(0));

            // Act
            var result = await _userService.DeleteAsync(userId);

            // Assert
            Assert.NotNull(result);
            
        }
    }
}
