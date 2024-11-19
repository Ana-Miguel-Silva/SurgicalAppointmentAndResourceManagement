using Microsoft.EntityFrameworkCore;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Infrastructure.Users;
using DDDSample1.Infrastructure.Appointments;
using DDDSample1.Domain.Appointments;
using DDDSample1.Infrastructure.SurgeryRooms;
using DDDSample1.Domain.SurgeryRooms;
using DDDSample1.Infrastructure.OperationRequests;
using DDDSample1.Infrastructure.Staff;
using DDDSample1.Infrastructure.OperationTypes;
using DDDSample1.Infrastructure.Patients;
using DDDSample1.Domain.Logging;
using DDDSample1.Infrastructure.Logging;
using DDDSample1.Domain.Patients;
using DDDSample1.Infrastructure.PendingActions;
using DDDSample1.Domain.PendingActions;

namespace DDDSample1.Infrastructure
{
    public class DDDSample1DbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<OperationRequest> OperationRequests { get; set; }
        public DbSet<StaffProfile> StaffProfiles { get; set; }
        public DbSet<OperationType> OperationTypes { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<LogEntry> Logs { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<SurgeryRoom> SurgeryRooms { get; set; }
        public DbSet<PendingActionsEntry> PendingActions { get; set; }

        public DDDSample1DbContext(DbContextOptions options) : base(options)
        {

        }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new UserEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new OperationRequestEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new StaffEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new OperationTypeEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new PatientEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new LogEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new PendingActionsEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new AppointmentEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new SurgeryRoomEntityTypeConfiguration());
        }
    }
}