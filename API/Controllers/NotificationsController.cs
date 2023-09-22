using Application.Notifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class NotificationsController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetNotifications()
        {
            return HandleResult(await Mediator.Send(new List.Query { }));
        }
    }
}