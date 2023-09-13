using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile([FromRoute] string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
        }

        [HttpPut]
        public async Task<IActionResult> Edit([FromBody] Update.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetUserActivities([FromRoute] string username, [FromQuery] string predicate)
        {
            return HandleResult(await Mediator.Send(
                new ListActivities.Query
                {
                    Username = username,
                    Predicate = predicate
                }));
        }
    }
}