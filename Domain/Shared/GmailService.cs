using System.Net;
using System.Net.Mail;
using DDDSample1.Domain.Shared;
using Microsoft.Extensions.Options;

public class GmailService : IMailService
{
    private readonly GmailOptions _gmailOptions;

    public GmailService(IOptions<GmailOptions> gmailOptions)
    {
        _gmailOptions = gmailOptions.Value;
    }

    public async Task SendEmailAsync(SendEmailRequest sendEmailRequest)
    {
        var smtpClient = new SmtpClient(_gmailOptions.SmtpServer)
        {
            Port = _gmailOptions.SmtpPort,
            Credentials = new NetworkCredential(_gmailOptions.Email, _gmailOptions.Password),
            EnableSsl = true,
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(_gmailOptions.Email),
            Subject = sendEmailRequest.Subject,
            Body = sendEmailRequest.Body,
            IsBodyHtml = true,
        };

        mailMessage.To.Add(sendEmailRequest.Recipient);

        await smtpClient.SendMailAsync(mailMessage);
    }
}
