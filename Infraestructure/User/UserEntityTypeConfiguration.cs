using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.Users;

namespace DDDSample1.Infrastructure.Users
{
    public class UserEntityTypeConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(u => u.Id); // Primary key

            builder.OwnsOne(u => u.Email, emailBuilder =>
            {
                emailBuilder.Property(e => e.FullEmail).HasColumnName("Email").IsRequired();
                
                 emailBuilder.HasIndex(e => e.FullEmail).IsUnique();
            });

            builder.OwnsOne(u => u.Password, passwordBuilder =>
            {
                passwordBuilder.Property(e => e.Pass).HasColumnName("Password");
            });


            builder.Property(u => u.Username)
                .IsRequired()
                .HasMaxLength(100);

             builder.HasIndex(u => u.Username).IsUnique();

            builder.Property(u => u.Role)
                .IsRequired();

            builder.Property(u => u.FailedLoginAttempts)
                .HasColumnName("FailedLoginAttempts")
                .IsRequired();

            builder.Property(u => u.LockoutEndTime)
                .HasColumnName("LockoutEndTime")
                .IsRequired(false); 

        }
    }
}