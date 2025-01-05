using System;
using Xunit;
using DDDSample1.Domain.RoomTypess;
using DDDSample1.Domain.Shared;

namespace Domain.Tests
{
    public class RoomTypesTests
    {
        [Fact]
        public void Constructor_InitializesProperties_WhenValidParameters()
        {
            // Arrange
            var roomTypeId = new RoomTypeId("A101-123");
            var designacao = "Operation Room";
            var descricao = "A suitable room for surgery";
            var surgerySuitable = true;

            // Act
            var roomType = new RoomTypes(roomTypeId, designacao, descricao, surgerySuitable);

            // Assert
            Assert.Equal(roomTypeId, roomType.ObtainCode());
            Assert.Equal(designacao, roomType.ObtainDesignacao());
            Assert.Equal(descricao, roomType.ObtainDescricao());
            Assert.Equal(surgerySuitable, roomType.ObtainSurgerySuitability());
            Assert.NotNull(roomType.ObtainId());
        }

        [Fact]
        public void ChangeDesignacao_ThrowsException_WhenDesignacaoIsEmpty()
        {
            // Arrange
            var roomTypeId = new RoomTypeId("A101-123");
            var roomType = new RoomTypes(roomTypeId, "Operation Room", "A room for surgery", true);

            // Act & Assert
            var exception = Assert.Throws<ArgumentException>(() => roomType.ChangeDesignacao(""));
            Assert.Equal("Designacao must not be empty or exceed 100 characters.", exception.Message);
        }

        [Fact]
        public void ChangeDesignacao_ThrowsException_WhenDesignacaoIsTooLong()
        {
            // Arrange
            var roomTypeId = new RoomTypeId("A101-123");
            var roomType = new RoomTypes(roomTypeId, "Operation Room", "A room for surgery", true);
            string longDesignacao = new string('A', 101); // 101 characters

            // Act & Assert
            var exception = Assert.Throws<ArgumentException>(() => roomType.ChangeDesignacao(longDesignacao));
            Assert.Equal("Designacao must not be empty or exceed 100 characters.", exception.Message);
        }

        [Fact]
        public void ChangeDesignacao_UpdatesDesignacao_WhenValidDesignacaoIsProvided()
        {
            // Arrange
            var roomTypeId = new RoomTypeId("A101-123");
            var roomType = new RoomTypes(roomTypeId, "Operation Room", "A room for surgery", true);
            var newDesignacao = "Operating Theatre";

            // Act
            roomType.ChangeDesignacao(newDesignacao);

            // Assert
            Assert.Equal(newDesignacao, roomType.ObtainDesignacao());
        }

        [Fact]
        public void ChangeDescricao_UpdatesDescricao_WhenCalled()
        {
            // Arrange
            var roomTypeId = new RoomTypeId("A101-123");
            var roomType = new RoomTypes(roomTypeId, "Operation Room", "A room for surgery", true);
            var newDescricao = "A renovated room suitable for surgeries.";

            // Act
            roomType.ChangeDescricao(newDescricao);

            // Assert
            Assert.Equal(newDescricao, roomType.ObtainDescricao());
        }

        [Fact]
        public void ChangeSurgerySuitable_UpdatesSurgerySuitable_WhenCalled()
        {
            // Arrange
            var roomTypeId = new RoomTypeId("A101-123");
            var roomType = new RoomTypes(roomTypeId, "Operation Room", "A room for surgery", true);
            var newSurgerySuitable = false;

            // Act
            roomType.ChangeSurgerySuitable(newSurgerySuitable);

            // Assert
            Assert.False(roomType.ObtainSurgerySuitability());
        }

        [Fact]
        public void ToString_ReturnsExpectedString_WhenCalled()
        {
            // Arrange
            var roomTypeCode = new RoomTypeId("A101-123");
            var roomType = new RoomTypes(roomTypeCode, "Operation Room", "A room for surgery", true);

            // Act
            var result = roomType.ToString();

            // Assert
            Assert.Contains(roomTypeCode.ToString(), result); // Verifica se o ID está presente na string
            Assert.Contains("Operation Room", result);      // Verifica se a designação está correta
            Assert.Contains("A room for surgery", result);  // Verifica se a descrição está presente
            Assert.Contains("True", result);                // Verifica se o valor de SurgerySuitable (True) está presente
        }

    }
}
