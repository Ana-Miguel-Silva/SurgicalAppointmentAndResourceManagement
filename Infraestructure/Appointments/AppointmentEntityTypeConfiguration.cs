using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.Appointments;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Domain.OperationRequests;

namespace DDDSample1.Infrastructure.Appointments
{
    internal class AppointmentEntityTypeConfiguration : IEntityTypeConfiguration<Appointment>
    {
        public void Configure(EntityTypeBuilder<Appointment> builder)
        {
            builder.HasKey(b => b.Id);

            builder.OwnsOne(a => a.Date, slotBuilder =>
            {
                slotBuilder.Property(s => s.StartTime)
                           .HasColumnName("StartTime")
                           .IsRequired();

                slotBuilder.Property(s => s.EndTime)
                           .HasColumnName("EndTime")
                           .IsRequired();
            });
        }
    }
}
