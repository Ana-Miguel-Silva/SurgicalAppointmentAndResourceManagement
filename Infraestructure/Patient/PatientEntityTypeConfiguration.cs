using DDDSample1.Domain.Patients;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace DDDSample1.Infrastructure.Patients
{
    public class PatientEntityTypeConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
            builder.HasKey(u => u.Id); // Primary key

            builder.OwnsOne(sp => sp.name, nameBuilder =>
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

            builder.OwnsOne(p => p.Phone, phoneBuilder =>
            {
                phoneBuilder.Property(pn => pn.Number)
                    .HasColumnName("PhoneNumber")
                    .IsRequired()
                    .HasMaxLength(9);
            });

            // Emergency Contact Phone Mapping
            builder.OwnsOne(p => p.EmergencyContact, emergencyContactBuilder =>
            {
                emergencyContactBuilder.Property(pn => pn.Number)
                    .HasColumnName("EmergencyContactNumber")
                    .IsRequired()
                    .HasMaxLength(9);
            });

            builder.OwnsOne(u => u.Email, emailBuilder =>
            {
                emailBuilder.Property(e => e.FullEmail)
                    .HasColumnName("Email")
                    .IsRequired();
                emailBuilder.HasIndex(e => e.FullEmail).IsUnique();
            });

            // UserEmail Mapping (Another Email field if needed)
            builder.OwnsOne(u => u.UserEmail, userEmailBuilder =>
            {
                userEmailBuilder.Property(e => e.FullEmail)
                    .HasColumnName("UserEmail")
                    .IsRequired();
                userEmailBuilder.HasIndex(e => e.FullEmail).IsUnique();
            });

        }
    }
}