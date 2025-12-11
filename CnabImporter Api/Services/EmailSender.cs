using System.Net.Mail;
using System.Net.Mime;

namespace Api.Services;

public interface IEmailSender
{
    Task SendAsync(string recipient, string subject, string message, Action? onSuccess = null, Action? onError = null);
}

public sealed class EmailSender(IOptions<Smtp> smtpEmail, ILogger<EmailSender> logger) : IEmailSender
{
    public async Task SendAsync(string recipient, string subject, string message, Action? onSuccess = null, Action? onError = null)
    {
        try
        {
            SmtpClient smtp = new(smtpEmail.Value.Host, smtpEmail.Value.Port)
            {
                Credentials = new NetworkCredential(smtpEmail.Value.User, smtpEmail.Value.Pass),
                EnableSsl = smtpEmail.Value.Ssl
            };

            MailMessage msg = BuildMessage(smtpEmail, recipient, subject, message);

            smtp.SendCompleted += (_, e) =>
            {
                if (e.Error is null)
                {
                    onSuccess?.Invoke();

                    return;
                }

                onError?.Invoke();
            };

            await smtp.SendMailAsync(msg);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "EmailSender - SendAsync - Error.");
        }
    }

    private static MailMessage BuildMessage(IOptions<Smtp> smtpEmail, string recipient, string subject, string message)
    {
        AlternateView avHtml = AlternateView.CreateAlternateViewFromString(message, Encoding.UTF8, MediaTypeNames.Text.Html);

        MailAddress from = new(smtpEmail.Value.From, smtpEmail.Value.Display, Encoding.UTF8);
        MailAddress to = new(recipient, recipient, Encoding.UTF8);

        MailMessage msg = new(from, to);
        msg.AlternateViews.Add(avHtml);

        msg.IsBodyHtml = true;
        msg.BodyEncoding = Encoding.UTF8;
        msg.Subject = subject;
        msg.SubjectEncoding = Encoding.UTF8;

        return msg;
    }
}
