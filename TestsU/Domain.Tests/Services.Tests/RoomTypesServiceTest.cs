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
    

        
    }
}
