using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.RoomTypess;

namespace DDDSample1.Infrastructure.RoomTypess
{
    public class RoomTypesEntityTypeConfiguration : IEntityTypeConfiguration<RoomTypes>
    {
        public void Configure(EntityTypeBuilder<RoomTypes> builder)
        {
            // Chave primária
            builder.HasKey(u => u.Id); 

            builder.Property(u => u.Id)
                .IsRequired()
                .HasColumnName("RoomTId"); // Nome da coluna

            // Configuração para o RoomTypeId



            builder.Property(u => u.Code)
                .HasConversion(
                    v => v.Value,                  
                    v => new RoomTypeId(v))        
                .IsRequired()
                .HasColumnName("Code"); // Nome da coluna

            // Configuração da Designacao (com tamanho máximo de 100 caracteres)
            builder.Property(u => u.Designacao)
                .IsRequired()
                .HasMaxLength(100)
                .HasColumnName("Designacao"); // Nome da coluna

            // Configuração da Descrição (opcional)
            builder.Property(u => u.Descricao)
                .HasColumnName("Descricao") // Nome da coluna
                .HasMaxLength(255); // Tamanho máximo (se necessário)

            // Configuração de SurgerySuitable (booleano)
            builder.Property(u => u.SurgerySuitable)
                .IsRequired()
                .HasColumnName("SurgerySuitable"); // Nome da coluna

            // Definir índices e garantir unicidade de algumas colunas, caso necessário
            builder.HasIndex(u => u.Code).IsUnique();
        }
    }
}
