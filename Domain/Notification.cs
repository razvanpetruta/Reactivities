using System.ComponentModel.DataAnnotations;

namespace Domain
{
    public class Notification
    {
        [Key]
        public Guid Id { get; set; }
        public string RecipientId { get; set; }
        public AppUser Recipient { get; set; }
        public string SenderId { get; set; }
        public AppUser Sender { get; set; }
        public Utils.Type Type { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; } = false;
        public Guid? ActivityId { get; set; }
    }
}