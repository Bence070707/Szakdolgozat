using System;

namespace API.Interfaces;

public interface IEmailService
{
    public Task SendEmailAsync(string subject, string body);
}
