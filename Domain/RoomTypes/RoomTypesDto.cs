using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.RoomTypess
{
    public class RoomTypesDto
    {
        public string RoomTypeId { get; set; }
        public string Code { get; set; }
        public string Designacao { get; set; }
        public string? Descricao { get; set; }
        public bool SurgerySuitable { get; set; }

        public RoomTypesDto(string roomTypeId, string code, string designacao, string? descricao, bool surgerySuitable)
        {
            this.RoomTypeId = roomTypeId;
            this.Code = code;
            this.Designacao = designacao;
            this.Descricao = descricao;
            this.SurgerySuitable = surgerySuitable;
        }


    }
}