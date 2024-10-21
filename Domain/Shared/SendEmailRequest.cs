namespace DDDSample1.Domain.Shared;

public record SendEmailRequest(string Recipient, string Subject, string Body);