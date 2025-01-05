using System;
using Xunit;
using DDDSample1.Domain.RoomTypess;

namespace DDDSample1.Domain.Tests
{
    public class RoomTypeIdTests
    {
        [Fact]
        public void Constructor_InitializesValue_WhenValidId()
        {
            // Arrange
            var validRoomTypeId = "A101-123";

            // Act
            var roomTypeId = new RoomTypeId(validRoomTypeId);

            // Assert
            Assert.Equal(validRoomTypeId, roomTypeId.Value);
        }

        [Fact]
        public void Constructor_ThrowsArgumentException_WhenInvalidId()
        {
            // Arrange
            var invalidRoomTypeId = "Invalid@123"; // Esse ID tem caracteres inválidos

            // Act & Assert
            var exception = Assert.Throws<ArgumentException>(() => new RoomTypeId(invalidRoomTypeId));
            Assert.Equal("RoomTypeId must be exactly 8 characters long, without spaces, and only contain letters, numbers, or '-'.", exception.Message);
        }

        [Fact]
        public void Constructor_ThrowsArgumentException_WhenIdIsTooShort()
        {
            // Arrange
            var shortRoomTypeId = "ABC-1"; // Menos de 8 caracteres

            // Act & Assert
            var exception = Assert.Throws<ArgumentException>(() => new RoomTypeId(shortRoomTypeId));
            Assert.Equal("RoomTypeId must be exactly 8 characters long, without spaces, and only contain letters, numbers, or '-'.", exception.Message);
        }

        [Fact]
        public void Constructor_ThrowsArgumentException_WhenIdHasSpaces()
        {
            // Arrange
            var invalidRoomTypeId = "A101 123"; // Contém espaço

            // Act & Assert
            var exception = Assert.Throws<ArgumentException>(() => new RoomTypeId(invalidRoomTypeId));
            Assert.Equal("RoomTypeId must be exactly 8 characters long, without spaces, and only contain letters, numbers, or '-'.", exception.Message);
        }

        [Fact]
        public void Constructor_ThrowsArgumentException_WhenIdContainsSpecialCharacters()
        {
            // Arrange
            var invalidRoomTypeId = "A101!@#"; // Contém caracteres especiais inválidos

            // Act & Assert
            var exception = Assert.Throws<ArgumentException>(() => new RoomTypeId(invalidRoomTypeId));
            Assert.Equal("RoomTypeId must be exactly 8 characters long, without spaces, and only contain letters, numbers, or '-'.", exception.Message);
        }

        [Fact]
        public void ToString_ReturnsCorrectString_WhenCalled()
        {
            // Arrange
            var roomTypeId = new RoomTypeId("A101-123");

            // Act
            var result = roomTypeId.ToString();

            // Assert
            Assert.Equal("A101-123", result);
        }

        [Fact]
        public void Equals_ReturnsTrue_WhenEqualRoomTypeIds()
        {
            // Arrange
            var roomTypeId1 = new RoomTypeId("A101-123");
            var roomTypeId2 = new RoomTypeId("A101-123");

            // Act
            var result = roomTypeId1.Equals(roomTypeId2);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void Equals_ReturnsFalse_WhenDifferentRoomTypeIds()
        {
            // Arrange
            var roomTypeId1 = new RoomTypeId("A101-123");
            var roomTypeId2 = new RoomTypeId("B202-234");

            // Act
            var result = roomTypeId1.Equals(roomTypeId2);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void GetHashCode_ReturnsSameHashCode_WhenRoomTypeIdsAreEqual()
        {
            // Arrange
            var roomTypeId1 = new RoomTypeId("A101-123");
            var roomTypeId2 = new RoomTypeId("A101-123");

            // Act
            var hashCode1 = roomTypeId1.GetHashCode();
            var hashCode2 = roomTypeId2.GetHashCode();

            // Assert
            Assert.Equal(hashCode1, hashCode2);
        }

        [Fact]
        public void GetHashCode_ReturnsDifferentHashCode_WhenRoomTypeIdsAreDifferent()
        {
            // Arrange
            var roomTypeId1 = new RoomTypeId("A101-123");
            var roomTypeId2 = new RoomTypeId("B202-234");

            // Act
            var hashCode1 = roomTypeId1.GetHashCode();
            var hashCode2 = roomTypeId2.GetHashCode();

            // Assert
            Assert.NotEqual(hashCode1, hashCode2);
        }
    }
}
