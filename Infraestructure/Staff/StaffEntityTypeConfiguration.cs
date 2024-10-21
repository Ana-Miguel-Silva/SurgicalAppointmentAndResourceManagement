using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.Staff;

namespace DDDSample1.Infrastructure.Staff
{
    public class StaffEntityTypeConfiguration : IEntityTypeConfiguration<StaffProfile>
    {
        public void Configure(EntityTypeBuilder<StaffProfile> builder)
        {
            builder.HasKey(u => u.Id); // Primary key

            builder.OwnsOne(u => u.Email, emailBuilder =>
            {
                emailBuilder.Property(e => e.FullEmail).HasColumnName("Email"); // Map to column
            });

            builder.Property(u => u.Username)
                .IsRequired()
                .HasMaxLength(100); // Example constraints

            builder.OwnsOne(u => u.PhoneNumber, phoneBuilder =>
            {
                phoneBuilder.Property(e => e.Number)
                    .HasColumnName("PhoneNumber") 
                    .IsRequired() 
                    .HasMaxLength(9);
            });

            builder.Property(u => u.Specialization)
                .IsRequired()
                .HasMaxLength(50); // Example constraint, adjust as needed

            // Configure Active property
            builder.Property(u => u.Active)
                .IsRequired();
        }
    }
}