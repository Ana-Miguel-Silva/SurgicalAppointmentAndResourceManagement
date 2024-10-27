using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.PendingActions;


namespace DDDSample1.Infrastructure.PendingActions
{
    internal class PendingActionsEntityTypeConfiguration : IEntityTypeConfiguration<PendingActionsEntry>
    {
        public void Configure(EntityTypeBuilder<PendingActionsEntry> builder)
        {

            builder.HasKey(b => b.Id);

            builder.Property(b => b.Action)
                .IsRequired()
                .HasColumnType("text");



        }
    }
}