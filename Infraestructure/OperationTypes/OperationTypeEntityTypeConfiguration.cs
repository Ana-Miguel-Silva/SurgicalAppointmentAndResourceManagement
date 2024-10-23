using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.OperationTypes;

namespace DDDSample1.Infrastructure.OperationTypes
{
    public class OperationTypeEntityTypeConfiguration : IEntityTypeConfiguration<OperationType>
    {
        public void Configure(EntityTypeBuilder<OperationType> builder)
        {
            // Configure RequiredStaff as a collection
            builder.OwnsMany(ot => ot.RequiredStaff, staffBuilder =>
            {
                staffBuilder.ToTable("OperationTypeRequiredStaff");
                staffBuilder.WithOwner().HasForeignKey("OperationTypeId");

                staffBuilder.Property(rs => rs.Quantity).HasColumnName("Quantity");
                staffBuilder.Property(rs => rs.Specialization).HasColumnName("Specialization");
                staffBuilder.Property(rs => rs.Role).HasColumnName("Role");
            });

            // Configure EstimatedDuration as a single entity
            builder.OwnsOne(ot => ot.EstimatedDuration, durationBuilder =>
            {
                durationBuilder.Property(d => d.PatientPreparation)
                    .HasColumnName("PatientPreparationDuration")
                    .HasConversion(
                        v => v,  // Store TimeOnly directly
                        v => v); // Retrieve TimeOnly directly

                durationBuilder.Property(d => d.Surgery)
                    .HasColumnName("SurgeryDuration")
                    .HasConversion(
                        v => v,  // Store TimeOnly directly
                        v => v); // Retrieve TimeOnly directly

                durationBuilder.Property(d => d.Cleaning)
                    .HasColumnName("CleaningDuration")
                    .HasConversion(
                        v => v,  // Store TimeOnly directly
                        v => v); // Retrieve TimeOnly directly
            });
        }
    }
}