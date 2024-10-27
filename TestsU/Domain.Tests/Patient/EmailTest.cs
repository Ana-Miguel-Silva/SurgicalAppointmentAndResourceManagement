using System;
using Xunit;
using DDDSample1.Domain.Shared;

namespace Domain.Tests
{
    public class EmailTests
    {
        [Fact]
        public void Constructor_InitializesFullEmail_WhenValidEmail()
        {
            // Arrange
            var validEmail = "user@example.com";

            // Act
            var email = new Email(validEmail);

            // Assert
            Assert.Equal(validEmail, email.FullEmail);
        }

        [Fact]
        public void Constructor_ThrowsException_WhenEmailIsNull()
        {
            // Act & Assert
            Assert.Throws<ArgumentException>(() => new Email(null));
        }

        [Fact]
        public void Constructor_ThrowsException_WhenEmailIsEmpty()
        {
            // Act & Assert
            Assert.Throws<ArgumentException>(() => new Email(""));
        }

        [Fact]
        public void GetUsername_ReturnsCorrectUsername()
        {
            // Arrange
            var email = new Email("user@example.com");

            // Act
            var username = email.GetUsername();

            // Assert
            Assert.Equal("user", username);
        }

        [Fact]
        public void GetUsername_ReturnsEmpty_WhenEmailHasNoUsername()
        {
            // Arrange
            var email = new Email("@example.com");

            // Act
            var username = email.GetUsername();

            // Assert
            Assert.Equal(string.Empty, username);
        }

        [Fact]
        public void GetEqualityComponents_ReturnsCorrectComponents()
        {
            // Arrange
            var email1 = new Email("user@example.com");
            var email2 = new Email("user@example.com");

            // Act
            var components1 = email1.GetEqualityComponents();
            var components2 = email2.GetEqualityComponents();

            // Assert
            Assert.Equal(components1, components2);
        }

        [Fact]
        public void GetEqualityComponents_ReturnsDifferentComponents_ForDifferentEmails()
        {
            // Arrange
            var email1 = new Email("user@example.com");
            var email2 = new Email("other@example.com");

            // Act
            var components1 = email1.GetEqualityComponents();
            var components2 = email2.GetEqualityComponents();

            // Assert
            Assert.NotEqual(components1, components2);
        }
    }
}
