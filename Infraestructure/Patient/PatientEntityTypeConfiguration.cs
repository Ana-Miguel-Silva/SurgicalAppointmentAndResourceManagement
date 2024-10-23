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

            builder.OwnsOne(u => u.Email, emailBuilder =>
            {
                emailBuilder.Property(e => e.FullEmail).HasColumnName("Email").IsRequired(); // Map to column

                 emailBuilder.HasIndex(e => e.FullEmail).IsUnique();
            });

            
        }
    }
}