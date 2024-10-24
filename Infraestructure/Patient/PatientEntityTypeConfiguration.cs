using DDDSample1.Domain.Patients;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DDDSample1.Infrastructure.Patients
{
    public class PatientEntityTypeConfiguration : IEntityTypeConfiguration<Patient>
    {
        public void Configure(EntityTypeBuilder<Patient> builder)
        {
       
            builder.HasKey(u => u.Id);

       
            builder.OwnsOne(sp => sp.name, nameBuilder =>
            {
                nameBuilder.Property(n => n.FirstName)
                    .HasColumnName("FirstName")
                    .HasMaxLength(100)
                    .IsRequired();

                nameBuilder.Property(n => n.MiddleNames)
                    .HasColumnName("MiddleNames")
                    .HasMaxLength(200);

                nameBuilder.Property(n => n.LastName)
                    .HasColumnName("LastName")
                    .HasMaxLength(100)
                    .IsRequired();
            });

            builder.OwnsOne(p => p.Phone, phoneBuilder =>
            {
                phoneBuilder.Property(pn => pn.Number)
                    .HasColumnName("PhoneNumber")
                    .IsRequired()
                    .HasMaxLength(15); 
            });


            builder.OwnsOne(p => p.medicalRecordNumber, medicalRecordNumberBuilder =>
            {
                medicalRecordNumberBuilder.Property(pn => pn.number)
                    .HasColumnName("MedicalRecordNumber")
                    .IsRequired();                    
            });

    
            builder.OwnsOne(p => p.EmergencyContact, emergencyContactBuilder =>
            {
        
                emergencyContactBuilder.OwnsOne(ec => ec.Name, nameBuilder =>
                {
                    nameBuilder.Property(n => n.FirstName)
                        .HasColumnName("EmergencyContactFirstName")
                        .IsRequired();

                    nameBuilder.Property(n => n.LastName)
                        .HasColumnName("EmergencyContactLastName")
                        .IsRequired();
                });

     
                emergencyContactBuilder.OwnsOne(ec => ec.Phone, phoneBuilder =>
                {
                    phoneBuilder.Property(p => p.Number)
                        .HasColumnName("EmergencyContactPhone")
                        .IsRequired()
                        .HasMaxLength(15);
                });


                emergencyContactBuilder.OwnsOne(ec => ec.Email, emailBuilder =>
                {
                    emailBuilder.Property(e => e.FullEmail)
                        .HasColumnName("EmergencyContactEmail")
                        .IsRequired();
                });
            });


            builder.OwnsOne(u => u.Email, emailBuilder =>
            {
                emailBuilder.Property(e => e.FullEmail)
                    .HasColumnName("Email")
                    .IsRequired();
                emailBuilder.HasIndex(e => e.FullEmail).IsUnique();
            });


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
