using System.ComponentModel.DataAnnotations;

namespace Domain
{
    public class Comment
    {
        [Key]
        public int Id { get; set; }
        public string Body { get; set; }
        public AppUser Author { get; set; }
        public Activity Activity { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}