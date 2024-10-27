using System;
using Xunit;
using DDDSample1.Domain.Shared;

namespace Domain.Tests
{
    public class PhoneNumberTests
    {
        [Fact]
        public void Constructor_InitializesNumber_WhenValidNumber()
        {
            // Arrange
            var validPhoneNumber = "123456789";

            // Act
            var phoneNumber = new PhoneNumber(validPhoneNumber);

            // Assert
            Assert.Equal(validPhoneNumber, phoneNumber.Number);
        }

        [Fact]
        public void Constructor_ThrowsException_WhenNumberIsNull()
        {
            // Act & Assert
            Assert.Throws<ArgumentException>(() => new PhoneNumber(null));
        }

        [Fact]
        public void Constructor_ThrowsException_WhenNumberIsEmpty()
        {
            // Act & Assert
            Assert.Throws<ArgumentException>(() => new PhoneNumber(""));
        }

        [Fact]
        public void GetEqualityComponents_ReturnsCorrectComponents()
        {
            // Arrange
            var phoneNumber1 = new PhoneNumber("123456789");
            var phoneNumber2 = new PhoneNumber("123456789");

            // Act
            var components1 = phoneNumber1.GetEqualityComponents();
            var components2 = phoneNumber2.GetEqualityComponents();

            // Assert
            Assert.Equal(components1, components2);
        }

        [Fact]
        public void GetEqualityComponents_ReturnsDifferentComponents_ForDifferentNumbers()
        {
            // Arrange
            var phoneNumber1 = new PhoneNumber("123456789");
            var phoneNumber2 = new PhoneNumber("987654321");

            // Act
            var components1 = phoneNumber1.GetEqualityComponents();
            var components2 = phoneNumber2.GetEqualityComponents();

            // Assert
            Assert.NotEqual(components1, components2);
        }
    }
}
