using System.Text.Json.Serialization;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.RoomTypess
{
    public class CreatingRoomTypesDto
    {
        public string Code { get; set; }
        public string Designacao { get; set; }
        public string? Descricao { get; set; }
        public bool SurgerySuitable { get; set; }

        public CreatingRoomTypesDto( string code, string designacao, string? descricao, bool surgerySuitable)
        {
            Code = code;
            Designacao = designacao;
            Descricao = descricao;
            SurgerySuitable = surgerySuitable;
        }
        
    }
}
