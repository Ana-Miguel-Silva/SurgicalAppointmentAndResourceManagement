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

            builder.HasKey(sr => sr.Id);

            builder.Property(sr => sr.RoomNumber)
                   .IsRequired();
            
            builder.HasIndex(sr => sr.RoomNumber)
                   .IsUnique();

            builder.Property(sr => sr.AssignedEquipment)
                .HasColumnName("AssignedEquipment")
                .IsRequired(false);

            builder.OwnsMany(sr => sr.MaintenanceSlots, slotsBuilder =>
            {
                slotsBuilder.ToTable("SurgeryRoomMaintenanceSlots");

                slotsBuilder.WithOwner().HasForeignKey("SurgeryRoomId");

                slotsBuilder.Property(s => s.StartTime)
                            .HasColumnName("StartTime")
                            .IsRequired();

                slotsBuilder.Property(s => s.EndTime)
                            .HasColumnName("EndTime")
                            .IsRequired();

                slotsBuilder.HasKey("Id");
                slotsBuilder.Property<Guid>("Id")
                            .HasColumnName("SlotId")
                            .ValueGeneratedOnAdd();
            });
        }
    }
}
