using Application.Notifications;
using Domain;

namespace API.DTOs
{
    public class UserDTO
    {
        public string DisplayName { get; set; }
        public string Token { get; set; }
        public string Image { get; set; }
        public string Username { get; set; }
        public ICollection<NotificationDTO> Notifications { get; set; }
    }
}