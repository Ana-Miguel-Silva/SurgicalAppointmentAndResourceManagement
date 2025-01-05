using System;
using Xunit;
using DDDSample1.Domain.RoomTypess;

namespace DDDSample1.Domain.Tests
{
    public class RTIdTests
    {
        [Fact]
        public void Constructor_InitializesFromGuid_WhenValidGuid()
        {
            // Arrange
            var validGuid = Guid.NewGuid();

            // Act
            var rtId = new RTId(validGuid);

            // Assert
            Assert.Equal(validGuid, rtId.AsGuid());
        }

        [Fact]
        public void Constructor_InitializesFromString_WhenValidString()
        {
            // Arrange
            var validGuid = Guid.NewGuid().ToString();

            // Act
            var rtId = new RTId(validGuid);

            // Assert
            Assert.Equal(validGuid, rtId.AsString());
        }

        [Fact]
        public void CreateFromString_ReturnsGuid_WhenValidStringIsProvided()
        {
            // Arrange
            var validGuidString = Guid.NewGuid().ToString();

            // Act
            var rtId = (RTId)Activator.CreateInstance(typeof(RTId), validGuidString);

            // Assert
            Assert.Equal(new Guid(validGuidString), rtId.AsGuid());
        }

        [Fact]
        public void AsString_ReturnsCorrectString_WhenCalled()
        {
            // Arrange
            var validGuid = Guid.NewGuid();
            var rtId = new RTId(validGuid);

            // Act
            var result = rtId.AsString();

            // Assert
            Assert.Equal(validGuid.ToString(), result);
        }

        [Fact]
        public void AsGuid_ReturnsCorrectGuid_WhenCalled()
        {
            // Arrange
            var validGuid = Guid.NewGuid();
            var rtId = new RTId(validGuid);

            // Act
            var result = rtId.AsGuid();

            // Assert
            Assert.Equal(validGuid, result);
        }

        [Fact]
        public void ImplicitOperator_ThrowsNotImplementedException_WhenUsed()
        {
            // Arrange
            var validGuid = Guid.NewGuid();

            // Act & Assert
            var exception = Assert.Throws<NotImplementedException>(() => 
                _ = (RTId)validGuid);  // Testa o operador implícito que não foi implementado
        }

        [Fact]
        public void Equals_ReturnsTrue_WhenEqualRTIds()
        {
            // Arrange
            var rtId1 = new RTId(Guid.NewGuid());
            var rtId2 = new RTId(rtId1.AsGuid());

            // Act
            var result = rtId1.Equals(rtId2);

            // Assert
            Assert.True(result);
        }

        [Fact]
        public void Equals_ReturnsFalse_WhenDifferentRTIds()
        {
            // Arrange
            var rtId1 = new RTId(Guid.NewGuid());
            var rtId2 = new RTId(Guid.NewGuid());

            // Act
            var result = rtId1.Equals(rtId2);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public void GetHashCode_ReturnsSameHashCode_WhenRTIdsAreEqual()
        {
            // Arrange
            var rtId1 = new RTId(Guid.NewGuid());
            var rtId2 = new RTId(rtId1.AsGuid());

            // Act
            var hashCode1 = rtId1.GetHashCode();
            var hashCode2 = rtId2.GetHashCode();

            // Assert
            Assert.Equal(hashCode1, hashCode2);
        }

        [Fact]
        public void GetHashCode_ReturnsDifferentHashCode_WhenRTIdsAreDifferent()
        {
            // Arrange
            var rtId1 = new RTId(Guid.NewGuid());
            var rtId2 = new RTId(Guid.NewGuid());

            // Act
            var hashCode1 = rtId1.GetHashCode();
            var hashCode2 = rtId2.GetHashCode();

            // Assert
            Assert.NotEqual(hashCode1, hashCode2);
        }
    }
}
