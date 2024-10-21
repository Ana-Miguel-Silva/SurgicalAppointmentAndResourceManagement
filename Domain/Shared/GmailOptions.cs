namespace DDDSample1.Domain.Shared;

public class GmailOptions
{
    public const string GmailOptionsKey = "GmailOptions";
    
    public string SmtpServer { get; set; }
    public int SmtpPort { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
}