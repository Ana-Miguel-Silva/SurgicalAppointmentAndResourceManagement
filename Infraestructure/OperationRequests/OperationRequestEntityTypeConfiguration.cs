using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using DDDSample1.Domain.OperationRequests;

namespace DDDSample1.Infrastructure.OperationRequests
{
    internal class OperationRequestEntityTypeConfiguration : IEntityTypeConfiguration<OperationRequest>
    {
        public void Configure(EntityTypeBuilder<OperationRequest> builder)
        {
            //builder.ToTable("OperatiosRequests", SchemaNames.DDDSample1);
            builder.HasKey(b => b.Id);
        }
    }
}