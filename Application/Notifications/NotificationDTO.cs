using Domain;

namespace Application.Notifications
{
    public class NotificationDTO
    {
        public Guid Id { get; set; }
        public string RecipientUsername { get; set; }
        public string RecipientDisplayName { get; set; }
        public string SenderUsername { get; set; }
        public string SenderDisplayName { get; set; }
        public Utils.Type Type { get; set; }
        public DateTime Date { get; set; }
        public bool IsRead { get; set; }
        public Guid? ActivityId { get; set; }
    }
}