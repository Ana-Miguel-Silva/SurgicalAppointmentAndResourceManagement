using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Domain.Shared;

namespace DDDSample1.Infrastructure.SurgeryRooms
{
    public class SurgeryRoomEntityTypeConfiguration : IEntityTypeConfiguration<SurgeryRoom>
    {
        public void Configure(EntityTypeBuilder<SurgeryRoom> builder)
        {

            // Mapping the Slot value object
            builder.OwnsMany(sr => sr.MaintenanceSlots, slotsBuilder =>
            {
                slotsBuilder.ToTable("SurgeryRoomMaintenanceSlots");
                slotsBuilder.WithOwner().HasForeignKey("SurgeryRoomId");

                slotsBuilder.Property(s => s.StartDate).HasColumnName("StartDate");
                slotsBuilder.Property(s => s.EndDate).HasColumnName("EndDate");
                slotsBuilder.Property(s => s.StartTime).HasColumnName("StartTime");
                slotsBuilder.Property(s => s.EndTime).HasColumnName("EndTime");
            });
        }
    }
}