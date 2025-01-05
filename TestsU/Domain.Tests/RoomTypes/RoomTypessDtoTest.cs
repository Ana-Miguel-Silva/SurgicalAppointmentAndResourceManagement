using System;
using Xunit;
using DDDSample1.Domain.RoomTypess;

namespace DDDSample1.Domain.Tests
{
    public class RoomTypesDtoTests
    {
        [Fact]
        public void Constructor_InitializesProperties_WhenValidParameters()
        {
            // Arrange
            var roomTypeId = "A101-123";
            var code = "B456-789";
            var designacao = "Operation Room";
            var descricao = "A room for surgery";
            var surgerySuitable = true;

            // Act
            var roomTypesDto = new RoomTypesDto(roomTypeId, code, designacao, descricao, surgerySuitable);

            // Assert
            Assert.Equal(roomTypeId, roomTypesDto.RoomTypeId);
            Assert.Equal(code, roomTypesDto.Code);
            Assert.Equal(designacao, roomTypesDto.Designacao);
            Assert.Equal(descricao, roomTypesDto.Descricao);
            Assert.True(roomTypesDto.SurgerySuitable);
        }

        [Fact]
        public void Constructor_SetsPropertiesToNull_WhenDescricaoIsNull()
        {
            // Arrange
            var roomTypeId = "A101-123";
            var code = "B456-789";
            var designacao = "Operation Room";
            string? descricao = null;
            var surgerySuitable = true;

            // Act
            var roomTypesDto = new RoomTypesDto(roomTypeId, code, designacao, descricao, surgerySuitable);

            // Assert
            Assert.Equal(roomTypeId, roomTypesDto.RoomTypeId);
            Assert.Equal(code, roomTypesDto.Code);
            Assert.Equal(designacao, roomTypesDto.Designacao);
            Assert.Null(roomTypesDto.Descricao); // Espera-se que seja null
            Assert.True(roomTypesDto.SurgerySuitable);
        }

        [Fact]
        public void Setter_UpdateProperties_WhenChanged()
        {
            // Arrange
            var roomTypeId = "A101-123";
            var code = "B456-789";
            var designacao = "Operation Room";
            var descricao = "A room for surgery";
            var surgerySuitable = true;

            var roomTypesDto = new RoomTypesDto(roomTypeId, code, designacao, descricao, surgerySuitable);

            // Act - Atualiza as propriedades
            roomTypesDto.RoomTypeId = "C789-012";
            roomTypesDto.Code = "D345-678";
            roomTypesDto.Designacao = "ICU";
            roomTypesDto.Descricao = "Intensive care unit";
            roomTypesDto.SurgerySuitable = false;

            // Assert
            Assert.Equal("C789-012", roomTypesDto.RoomTypeId);
            Assert.Equal("D345-678", roomTypesDto.Code);
            Assert.Equal("ICU", roomTypesDto.Designacao);
            Assert.Equal("Intensive care unit", roomTypesDto.Descricao);
            Assert.False(roomTypesDto.SurgerySuitable);
        }

        [Fact]
        public void Constructor_DoesNotThrow_WhenDescricaoIsNull()
        {
            // Arrange
            var roomTypeId = "A101-123";
            var code = "B456-789";
            var designacao = "Operation Room";
            string? descricao = null;
            var surgerySuitable = true;

            // Act & Assert
            var exception = Record.Exception(() => new RoomTypesDto(roomTypeId, code, designacao, descricao, surgerySuitable));
            Assert.Null(exception);
        }
    }
}
