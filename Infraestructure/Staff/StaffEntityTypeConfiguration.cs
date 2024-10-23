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

            builder.OwnsOne(u => u.Name, fullNameBuilder => 
            {
                fullNameBuilder.Property(e => e.getFull())
                    .HasColumnName("FullName")
                    .IsRequired();
            });
                

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

            builder.Property(u => u.Role)
                .IsRequired()
                .HasMaxLength(50);

            builder.Property(u => u.LicenseNumber)
                .IsRequired()
                .HasMaxLength(10);

            // Configure Active property
            builder.Property(u => u.Active)
                .IsRequired();


            builder.OwnsMany(u => u.AvailabilitySlots, slotBuilder =>
            {
                slotBuilder.WithOwner().HasForeignKey("StaffId");

                slotBuilder.Property(s => s.StartTime)
                    .HasColumnName("StartTime")
                    .IsRequired();

                slotBuilder.Property(s => s.EndTime)
                    .HasColumnName("EndTime")
                    .IsRequired();

                slotBuilder.ToTable("StaffAvailabilitySlots");
            });
        }
    }
}