    using System;
    
    using DDDSample1.Domain.Shared;
    using System.Text.RegularExpressions;

    namespace DDDSample1.Domain.RoomTypess
    {

        public class RoomTypes : Entity<RTId>, IAggregateRoot{

        private const int MaxDesignationLength = 100;

        public RTId Id { get;  set; }
        public RoomTypeId Code { get;  set; }

        public string Designacao { get;  set; }
        public string? Descricao { get;  set; }
        public bool SurgerySuitable { get;  set; }

        

        private RoomTypes() { }

        public RoomTypes(RoomTypeId roomTypeId, string designacao, string? descricao, bool surgerySuitable)
        {
            Id = new RTId(Guid.NewGuid());
            Code = roomTypeId ?? throw new ArgumentNullException(nameof(roomTypeId));
            ChangeDesignacao(designacao);
            Descricao = descricao;
            SurgerySuitable = surgerySuitable;
        }

        public void ChangeDesignacao(string designacao)
        {
            if (string.IsNullOrWhiteSpace(designacao) || designacao.Length > MaxDesignationLength)
            {
                throw new ArgumentException($"Designacao must not be empty or exceed {MaxDesignationLength} characters.");
            }

            Designacao = designacao;
        }

        public void ChangeDescricao(string? descricao)
        {
            Descricao = descricao;
        }

        public void ChangeSurgerySuitable(bool surgerySuitable)
        {
            SurgerySuitable = surgerySuitable;
        }

        public override string ToString()
        {
            return $"RoomTypes [Id={Id.Value}, Code={Code}, Designacao={Designacao}, Descricao={Descricao}, SurgerySuitable={SurgerySuitable}]";
        }

        public string ObtainDesignacao()
        {
            return Designacao;
        }

        public string? ObtainDescricao()
        {
            return Descricao;
        }

        public bool ObtainSurgerySuitability()
        {
            return SurgerySuitable;
        }

        public RoomTypeId ObtainCode()
        {
            return Code;
        }

        public RTId ObtainId()
        {
            return Id;
        }

    }
    }