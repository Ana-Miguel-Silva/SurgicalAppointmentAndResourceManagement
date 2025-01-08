using System;
using System.Threading.Tasks;
using Xunit;
using Moq;
using DDDSample1.Domain.Shared;
using DDDSample1.Domain.RoomTypess;
using DDDSample1.ApplicationService.RoomTypess;

namespace DDDSample1.Tests.ApplicationService
{
    public class RoomTypesServiceTest
    {
        [Fact]
        public async Task AddAsync_ShouldCreateRoomType_WhenValidDtoIsProvided()
        {
            var code = "RT89-001";
            var designacao = "Test Desigantion";
            var descricao = "Test Description";
            var surgerySuitable = true;

            var dto = new CreatingRoomTypesDto(code, designacao, descricao, surgerySuitable);

            var mockRepo = new Mock<IRoomTypesRepository>();
            var mockUnitOfWork = new Mock<IUnitOfWork>();

            var newRoomType = new RoomTypes(new RoomTypeId(code), designacao, descricao, surgerySuitable);

            mockRepo.Setup(r => r.AddAsync(It.IsAny<RoomTypes>()))
                .ReturnsAsync(newRoomType);

            mockRepo.Setup(r => r.GetByIdAsync(It.IsAny<RTId>()))
                .ReturnsAsync(newRoomType);

            var service = new RoomTypesService(mockUnitOfWork.Object, mockRepo.Object);

            var result = await service.AddAsync(dto);

            Assert.NotNull(result);
            Assert.Equal(code, result.Code.ToString());
            Assert.Equal(designacao, result.Designacao);
            Assert.Equal(descricao, result.Descricao);
            Assert.Equal(surgerySuitable, result.SurgerySuitable);

            mockRepo.Verify(r => r.AddAsync(It.IsAny<RoomTypes>()), Times.Once);
            mockUnitOfWork.Verify(u => u.CommitAsync(), Times.Once);
        }


        [Fact]
        public async Task AddAsync_ShouldNotCreateRoomType_WhenInvalidDtoIsProvided()
        {

            var code = "RT89-00";
            var designacao = "Test Desigantion";
            var descricao = "Test Description";
            var surgerySuitable = true;

            var dto = new CreatingRoomTypesDto(code, designacao, descricao, surgerySuitable);

            var mockRepo = new Mock<IRoomTypesRepository>();
            var mockUnitOfWork = new Mock<IUnitOfWork>();

            var service = new RoomTypesService(mockUnitOfWork.Object, mockRepo.Object);

            await Assert.ThrowsAsync<ArgumentException>(async () => await service.AddAsync(dto));
        }


        [Fact]
        public async Task GetByIdAsync_ShouldReturnRoomType_WhenValidIdIsProvided()
        {
            var code = "RT89-001";
            var designacao = "Test Desigantion";
            var descricao = "Test Description";
            var surgerySuitable = true;

            var newRoomType = new RoomTypes(new RoomTypeId(code), designacao, descricao, surgerySuitable);

            var mockRepo = new Mock<IRoomTypesRepository>();

            mockRepo.Setup(r => r.GetByIdAsync(It.IsAny<RTId>())).ReturnsAsync(newRoomType);

            var mockUnitOfWork = new Mock<IUnitOfWork>();

            var service = new RoomTypesService(mockUnitOfWork.Object, mockRepo.Object);

            var result = await service.GetByIdAsync(newRoomType.Id);

            Assert.NotNull(result);

        }


        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenInValidIdIsProvided()
        {
            var ID = new RTId(Guid.NewGuid());

            var mockRepo = new Mock<IRoomTypesRepository>();

            mockRepo.Setup(r => r.GetByIdAsync(It.IsAny<RTId>())).ReturnsAsync((RoomTypes)null);

            var mockUnitOfWork = new Mock<IUnitOfWork>();

            var service = new RoomTypesService(mockUnitOfWork.Object, mockRepo.Object);

            var result = await service.GetByIdAsync(ID);

            Assert.Null(result);
        }



        [Fact]
        public async Task GetSurgerySuitableActiveAsync_ShouldReturnActiveRoomTypes_WhenTheyExist()
        {

            var code = "RT89-001";
            var designacao = "Test Desigantion";
            var descricao = "Test Description";
            var surgerySuitable = true;


            var code1 = "RT89-002";
            var designacao1 = "Test Desigantion2";
            var descricao1 = "Test Description2";
            var surgerySuitable1 = false;

            var newRoomType = new RoomTypes(new RoomTypeId(code), designacao, descricao, surgerySuitable);

            var mockRepo = new Mock<IRoomTypesRepository>();
            var mockUnitOfWork = new Mock<IUnitOfWork>();

            var roomTypesList = new List<RoomTypes>
            {
                new RoomTypes(new RoomTypeId(code), designacao, descricao, surgerySuitable),
                new RoomTypes(new RoomTypeId(code1), designacao1, descricao1, surgerySuitable1)
            };

            mockRepo.Setup(r => r.GetSurgerySuitableActiveAsync())
                .ReturnsAsync(roomTypesList);

            var service = new RoomTypesService(mockUnitOfWork.Object, mockRepo.Object);

            var result = await service.GetSurgerySuitableActiveAsync();

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            mockRepo.Verify(r => r.GetSurgerySuitableActiveAsync(), Times.Once);
        }
    

                [Fact]
        public async Task UpdateAsync_ShouldUpdateRoomType_WhenValidDtoIsProvided()
        {
            var code = "RT89-001";
            var designacao = "Test Designation";
            var descricao = "Test Description";
            var surgerySuitable = true;

            var newRoomType = new RoomTypes(new RoomTypeId(code), designacao, descricao, surgerySuitable);
            var updatedDesignacao = "Updated Designation";
            var updatedDescricao = "Updated Description";
            var updatedSurgerySuitable = false;

            var dto = new RoomTypesDto(
                newRoomType.ObtainId().AsString(),
                newRoomType.ObtainCode().ToString(),
                updatedDesignacao,
                updatedDescricao,
                updatedSurgerySuitable
            );

            var mockRepo = new Mock<IRoomTypesRepository>();
            var mockUnitOfWork = new Mock<IUnitOfWork>();

            mockRepo.Setup(r => r.GetByIdAsync(It.IsAny<RTId>())).ReturnsAsync(newRoomType);

            var service = new RoomTypesService(mockUnitOfWork.Object, mockRepo.Object);

            var result = await service.UpdateAsync(dto);

            Assert.NotNull(result);
            Assert.Equal(updatedDesignacao, result.Designacao);
            Assert.Equal(updatedDescricao, result.Descricao);
            Assert.Equal(updatedSurgerySuitable, result.SurgerySuitable);

            mockRepo.Verify(r => r.GetByIdAsync(It.IsAny<RTId>()), Times.Once);
            mockUnitOfWork.Verify(u => u.CommitAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ShouldReturnNull_WhenRoomTypeDoesNotExist()
        {
            var dto = new RoomTypesDto("123e4567-e89b-12d3-a456-426614174000", "RT89-001", "Non-existent Designation", "Non-existent Description", true);

            var mockRepo = new Mock<IRoomTypesRepository>();
            var mockUnitOfWork = new Mock<IUnitOfWork>();

            mockRepo.Setup(r => r.GetByIdAsync(It.IsAny<RTId>())).ReturnsAsync((RoomTypes)null);

            var service = new RoomTypesService(mockUnitOfWork.Object, mockRepo.Object);

            var result = await service.UpdateAsync(dto);

            Assert.Null(result);

            mockRepo.Verify(r => r.GetByIdAsync(It.IsAny<RTId>()), Times.Once);
            mockUnitOfWork.Verify(u => u.CommitAsync(), Times.Never);
        }

        [Fact]
        public async Task GetByCodeAsync_ShouldReturnRoomType_WhenValidCodeIsProvided()
        {
            var code = "RT89-001";
            var designacao = "Test Desigantion";
            var descricao = "Test Description";
            var surgerySuitable = true;

            var roomType = new RoomTypes(new RoomTypeId(code), designacao, descricao, surgerySuitable);

            var mockRepo = new Mock<IRoomTypesRepository>();
            var mockUnitOfWork = new Mock<IUnitOfWork>();

            mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<RoomTypes> { roomType });

            var service = new RoomTypesService(mockUnitOfWork.Object, mockRepo.Object);

            var result = await service.GetByCodeAsync(code);

            Assert.NotNull(result);
            Assert.Equal(code, result.Code.ToString());
            Assert.Equal(designacao, result.Designacao);
            Assert.Equal(descricao, result.Descricao);
            Assert.Equal(surgerySuitable, result.SurgerySuitable);

            mockRepo.Verify(r => r.GetAllAsync(), Times.Once);
        }

        [Fact]
        public async Task GetByCodeAsync_ShouldReturnNull_WhenCodeNotFound()
        {
            var code = "RT99-001";

            var mockRepo = new Mock<IRoomTypesRepository>();
            var mockUnitOfWork = new Mock<IUnitOfWork>();

            mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<RoomTypes>());

            var service = new RoomTypesService(mockUnitOfWork.Object, mockRepo.Object);

            var result = await service.GetByCodeAsync(code);

            Assert.Null(result);

            mockRepo.Verify(r => r.GetAllAsync(), Times.Once);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllRoomTypes_WhenTheyExist()
        {
            var code1 = "RT89-001";
            var designacao1 = "Test Desigantion 1";
            var descricao1 = "Test Description 1";
            var surgerySuitable1 = true;

            var code2 = "RT89-002";
            var designacao2 = "Test Desigantion 2";
            var descricao2 = "Test Description 2";
            var surgerySuitable2 = false;

            var roomType1 = new RoomTypes(new RoomTypeId(code1), designacao1, descricao1, surgerySuitable1);
            var roomType2 = new RoomTypes(new RoomTypeId(code2), designacao2, descricao2, surgerySuitable2);

            var mockRepo = new Mock<IRoomTypesRepository>();
            var mockUnitOfWork = new Mock<IUnitOfWork>();

            var roomTypesList = new List<RoomTypes> { roomType1, roomType2 };

            mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(roomTypesList);

            var service = new RoomTypesService(mockUnitOfWork.Object, mockRepo.Object);

            var result = await service.GetAllAsync();

            Assert.NotNull(result);
            Assert.Equal(2, result.Count);

            // Verificar os valores dos RoomTypes
            Assert.Equal(roomType1.ObtainId().AsString(), result[0].RoomTypeId);
            Assert.Equal(roomType1.ObtainCode().ToString(), result[0].Code.ToString());
            Assert.Equal(roomType1.ObtainDesignacao(), result[0].Designacao);
            Assert.Equal(roomType1.ObtainDescricao(), result[0].Descricao);
            Assert.Equal(roomType1.ObtainSurgerySuitability(), result[0].SurgerySuitable);

            Assert.Equal(roomType2.ObtainId().AsString(), result[1].RoomTypeId);
            Assert.Equal(roomType2.ObtainCode().ToString(), result[1].Code.ToString());
            Assert.Equal(roomType2.ObtainDesignacao(), result[1].Designacao);
            Assert.Equal(roomType2.ObtainDescricao(), result[1].Descricao);
            Assert.Equal(roomType2.ObtainSurgerySuitability(), result[1].SurgerySuitable);

            mockRepo.Verify(r => r.GetAllAsync(), Times.Once);
        }



        
    }
}
