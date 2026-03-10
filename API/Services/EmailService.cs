using API.Entities;
using API.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

public class EmailService(IConfiguration config) : IEmailService
{
    private readonly EmailSettings? _settings = config.GetSection("EmailSettings").Get<EmailSettings>();

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        if (_settings is null)
            throw new InvalidOperationException("EmailSettings section is missing from configuration.");
        if (string.IsNullOrWhiteSpace(_settings.Password))
            throw new InvalidOperationException("EmailSettings:Password is empty. Set a valid SMTP/App password.");

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(
            _settings.SenderName,
            _settings.SenderEmail));

        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;
        body = body.Replace("\n", "<br>");
        message.Body = new TextPart("html")
        {
            Text = body
        };

        using var smtp = new SmtpClient();

        await smtp.ConnectAsync(
            _settings.SmtpServer,
            _settings.Port,
            SecureSocketOptions.StartTls);

        await smtp.AuthenticateAsync(
            _settings.Username,
            _settings.Password);

        await smtp.SendAsync(message);
        await smtp.DisconnectAsync(true);
    }
}
