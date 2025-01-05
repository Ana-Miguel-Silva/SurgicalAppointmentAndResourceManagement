using System;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.RoomTypess
{
    public class RoomTypesUpdateDto
    {
         public string RoomTypeId { get; set; }
        public string Designacao { get; set; }
        public string? Descricao { get; set; }
        public bool SurgerySuitable { get; set; }

        public RoomTypesUpdateDto(string designacao, string? descricao, bool surgerySuitable)
        {
            this.Designacao = designacao;
            this.Descricao = descricao;
            this.SurgerySuitable = surgerySuitable;
        }


    }
}