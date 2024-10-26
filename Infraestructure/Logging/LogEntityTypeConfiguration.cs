using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.Logging;

namespace DDDSample1.Infrastructure.Logging
{
    internal class LogEntityTypeConfiguration : IEntityTypeConfiguration<LogEntry>
    {
        public void Configure(EntityTypeBuilder<LogEntry> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Entity)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(b => b.Action)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(b => b.EntityId)
                .IsRequired();

            builder.Property(b => b.Changes)
                .IsRequired();

            builder.Property(b => b.UserEmail)
                .IsRequired();

            builder.Property(b => b.Date)
                .IsRequired();
        }
    }
}