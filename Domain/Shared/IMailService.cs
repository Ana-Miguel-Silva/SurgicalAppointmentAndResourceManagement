using DDDSample1.Domain.Shared;

namespace DDDSample1.Domain.Shared;

public interface IMailService
{
    Task SendEmailAsync(SendEmailRequest sendEmailRequest);
}