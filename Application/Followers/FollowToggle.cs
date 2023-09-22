using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _dataContext;
            public Handler(DataContext dataContext, IUserAccessor userAccessor)
            {
                _dataContext = dataContext;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                AppUser observer = await _dataContext.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());
                if (observer == null)
                    return null;

                AppUser target = await _dataContext.Users.FirstOrDefaultAsync(u => u.UserName == request.TargetUsername);
                if (target == null)
                    return null;

                UserFollowing following = await _dataContext.UserFollowings.FindAsync(observer.Id, target.Id);
                if (following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };
                    _dataContext.UserFollowings.Add(following);

                    Notification notification = new Notification
                    {
                        Recipient = target,
                        Sender = observer,
                        Type = Utils.Type.StartedFollowing
                    };
                    _dataContext.Notifications.Add(notification);
                }
                else
                {
                    _dataContext.UserFollowings.Remove(following);
                }

                bool success = await _dataContext.SaveChangesAsync() > 0;
                if (success)
                    return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failed to update following");
            }
        }
    }
}