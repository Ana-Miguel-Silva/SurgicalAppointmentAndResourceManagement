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
                emailBuilder.HasIndex(e => e.FullEmail).IsUnique();
            });

            builder.OwnsOne(sp => sp.Name, nameBuilder =>
            {
                nameBuilder.Property(n => n.FirstName)
                    .HasColumnName("FirstName")
                    .HasMaxLength(100);

                nameBuilder.Property(n => n.MiddleNames)
                    .HasColumnName("MiddleNames")
                    .HasMaxLength(200);

                nameBuilder.Property(n => n.LastName)
                    .HasColumnName("LastName")
                    .HasMaxLength(100);
            });


            builder.OwnsOne(u => u.PhoneNumber, phoneBuilder =>
            {
                phoneBuilder.Property(e => e.Number)
                    .HasColumnName("PhoneNumber")
                    .IsRequired()
                    .HasMaxLength(9);
                phoneBuilder.HasIndex(e => e.Number).IsUnique();
            });
            builder.Property(u => u.StaffId)
                .IsRequired();
            builder.Property(u => u.Specialization)
                .IsRequired()
                .HasMaxLength(50); // Example constraint, adjust as needed

            builder.Property(u => u.Role)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(u => u.LicenseNumber)
                .HasMaxLength(10);

            // Configure Active property
            builder.Property(u => u.Active)
                .IsRequired();


            builder.OwnsMany(sp => sp.AvailabilitySlots, slotsBuilder =>
            {
                slotsBuilder.ToTable("StaffAvailabilitySlots");
                slotsBuilder.WithOwner().HasForeignKey("StaffProfileId");
                slotsBuilder.Property(s => s.StartTime).HasColumnName("StartTime").IsRequired();
                slotsBuilder.Property(s => s.EndTime).HasColumnName("EndTime").IsRequired();

                
            });

            builder.HasIndex(u => u.LicenseNumber).IsUnique();
            builder.HasIndex(u => u.StaffId).IsUnique();
        }
    }
}