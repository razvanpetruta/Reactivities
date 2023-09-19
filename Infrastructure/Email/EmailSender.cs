using Microsoft.Extensions.Configuration;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Infrastructure.Email
{
    public class EmailSender
    {
        private readonly IConfiguration _configuration;
        public EmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string userEmail, string emailSubject, string message)
        {
            SendGridClient client = new SendGridClient(_configuration["Sendgrid:Key"]);
            SendGridMessage sendGridMessage = new SendGridMessage
            {
                From = new EmailAddress("reactdevelopment32@gmail.com", _configuration["Sendgrid:User"]),
                Subject = emailSubject,
                PlainTextContent = message,
                HtmlContent = message
            };
            sendGridMessage.AddTo(new EmailAddress(userEmail));
            sendGridMessage.SetClickTracking(false, false);

            await client.SendEmailAsync(sendGridMessage);
        }
    }
}