using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace EcoFeast.API.Services;

public interface IEmailService
{
    Task SendInquiryNotificationAsync(string customerName, string customerEmail, string company, string message);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendInquiryNotificationAsync(string customerName, string customerEmail, string company, string message)
    {
        var smtpHost = _config["Email:SmtpHost"] ?? "smtp.gmail.com";
        var smtpPort = int.Parse(_config["Email:SmtpPort"] ?? "587");
        var senderEmail = _config["Email:SenderEmail"] ?? "";
        var senderPassword = _config["Email:SenderPassword"] ?? "";
        var notifyEmails = _config["Email:NotifyEmail"] ?? senderEmail;

        if (string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(senderPassword))
        {
            _logger.LogWarning("Email not configured — skipping inquiry notification for {Name}", customerName);
            return;
        }

        var email = new MimeMessage();
        email.From.Add(new MailboxAddress("EcoFeast Nutrients", senderEmail));

        // Support multiple recipients (comma-separated)
        foreach (var addr in notifyEmails.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries))
        {
            email.To.Add(MailboxAddress.Parse(addr));
        }
        email.Subject = $"New Inquiry from {customerName}" + (string.IsNullOrEmpty(company) ? "" : $" — {company}");

        var html = $@"
<!DOCTYPE html>
<html>
<head>
  <style>
    body {{ font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #f4f1eb; }}
    .container {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }}
    .header {{ background: linear-gradient(135deg, #0C1A0A 0%, #1a2e14 100%); padding: 32px 40px; text-align: center; }}
    .header h1 {{ color: #C9A96E; font-size: 22px; margin: 0 0 4px; letter-spacing: 1px; }}
    .header p {{ color: rgba(232,224,208,0.6); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin: 0; }}
    .body {{ padding: 32px 40px; }}
    .label {{ font-size: 11px; color: #8a8070; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px; }}
    .value {{ font-size: 15px; color: #1a1a1a; margin-bottom: 20px; line-height: 1.6; }}
    .message-box {{ background: #f9f7f3; border-left: 3px solid #C9A96E; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-top: 8px; }}
    .footer {{ background: #f9f7f3; padding: 20px 40px; text-align: center; font-size: 12px; color: #8a8070; }}
    .reply-btn {{ display: inline-block; background: linear-gradient(135deg, #C9A96E, #A88B4A); color: #0C1A0A; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; margin-top: 16px; }}
  </style>
</head>
<body>
  <div class='container'>
    <div class='header'>
      <h1>EcoFeast Nutrients</h1>
      <p>New Inquiry Received</p>
    </div>
    <div class='body'>
      <div class='label'>From</div>
      <div class='value'><strong>{System.Net.WebUtility.HtmlEncode(customerName)}</strong></div>

      <div class='label'>Email</div>
      <div class='value'>{System.Net.WebUtility.HtmlEncode(customerEmail)}</div>

      {(string.IsNullOrEmpty(company) ? "" : $@"
      <div class='label'>Company</div>
      <div class='value'>{System.Net.WebUtility.HtmlEncode(company)}</div>
      ")}

      <div class='label'>Message</div>
      <div class='message-box'>{System.Net.WebUtility.HtmlEncode(message)}</div>

      <div style='text-align: center;'>
        <a href='mailto:{System.Net.WebUtility.HtmlEncode(customerEmail)}?subject=Re: Your inquiry to EcoFeast Nutrients' class='reply-btn'>Reply to {System.Net.WebUtility.HtmlEncode(customerName)}</a>
      </div>
    </div>
    <div class='footer'>
      EcoFeast Nutrients Pvt. Ltd. &middot; Mumbai, India<br/>
      This is an automated notification from your website contact form.
    </div>
  </div>
</body>
</html>";

        email.Body = new TextPart("html") { Text = html };

        try
        {
            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(senderEmail, senderPassword);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);

            _logger.LogInformation("Inquiry notification sent for {Name} <{Email}>", customerName, customerEmail);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send inquiry notification email for {Name}", customerName);
            // Don't throw — email failure shouldn't block the contact form submission
        }
    }
}
