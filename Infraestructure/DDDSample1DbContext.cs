using Microsoft.EntityFrameworkCore;
using DDDSample1.Domain.Categories;
using DDDSample1.Domain.Users;
using DDDSample1.Domain.Products;
using DDDSample1.Domain.Families;
using DDDSample1.Domain.OperationRequests;
using DDDSample1.Domain.Staff;
using DDDSample1.Domain.OperationTypes;
using DDDSample1.Infrastructure.Categories;
using DDDSample1.Infrastructure.Users;
using DDDSample1.Infrastructure.Products;
using DDDSample1.Infrastructure.OperationRequests;
using DDDSample1.Infrastructure.Staff;
using DDDSample1.Infrastructure.OperationTypes;
using DDDSample1.Infrastructure.Patients;
using DDDSample1.Domain.Patients;

namespace DDDSample1.Infrastructure
{
    public class DDDSample1DbContext : DbContext
    {
        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Family> Families { get; set; }
        public DbSet<OperationRequest> OperationRequests { get; set; }
        public DbSet<StaffProfile> StaffProfiles { get; set; }
        public DbSet<OperationType> OperationTypes { get; set; }

        public DbSet<Patient> Patients { get; set; }

        public DDDSample1DbContext(DbContextOptions options) : base(options)
        {

        }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfiguration(new CategoryEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new UserEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new ProductEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new FamilyEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new OperationRequestEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new StaffEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new OperationTypeEntityTypeConfiguration());
            modelBuilder.ApplyConfiguration(new PatientEntityTypeConfiguration());
        }
    }
}