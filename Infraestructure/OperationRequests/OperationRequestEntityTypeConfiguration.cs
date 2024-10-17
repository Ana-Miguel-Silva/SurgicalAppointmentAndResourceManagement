using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.OperationRequests;

namespace DDDSample1.Infrastructure.OperationRequests
{
    internal class OperationRequestEntityTypeConfiguration : IEntityTypeConfiguration<OperationRequest>
    {
        public void Configure(EntityTypeBuilder<OperationRequest> builder)
        {
            builder.HasKey(b => b.Id);

            builder.Property(b => b.Priority)
                .IsRequired() 
                .HasColumnName("Priority"); 
        }
    }

}