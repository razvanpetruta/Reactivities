using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                Activity activity = await _context.Activities
                    .Include(a => a.Attendees)
                        .ThenInclude(aa => aa.AppUser)
                    .FirstOrDefaultAsync(a => a.Id == request.Id);
                if (activity == null)
                    return null;

                AppUser user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());
                if (user == null)
                    return null;

                AppUser host = activity.Attendees.FirstOrDefault(a => a.IsHost).AppUser;
                string hostUsername = host.UserName;

                ActivityAttendee attendance = activity.Attendees.FirstOrDefault(a => a.AppUser.UserName == user.UserName);

                if (attendance != null && hostUsername == user.UserName)
                {
                    activity.IsCanceled = !activity.IsCanceled;
                    
                    foreach (var attendee in activity.Attendees.Where(a => !a.IsHost))
                    {
                        Notification notification = new Notification
                        {
                            Recipient = attendee.AppUser,
                            Sender = user,
                            Type = activity.IsCanceled ? Utils.Type.ActivityHasBeenCanceled : Utils.Type.ActivityHasBeenReactivated,
                            ActivityId = activity.Id
                        };
                        _context.Notifications.Add(notification);
                    }
                }

                if (attendance != null && hostUsername != user.UserName)
                {
                    activity.Attendees.Remove(attendance);

                    Notification notification = new Notification
                    {
                        Recipient = host,
                        Sender = user,
                        Type = Utils.Type.LeftActivity,
                        ActivityId = activity.Id
                    };
                    _context.Notifications.Add(notification);
                }

                if (attendance == null)
                {
                    attendance = new ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    };
                    activity.Attendees.Add(attendance);

                    Notification notification = new Notification
                    {
                        Recipient = host,
                        Sender = user,
                        Type = Utils.Type.JoinedActivity,
                        ActivityId = activity.Id
                    };
                    _context.Notifications.Add(notification);
                }

                bool result = await _context.SaveChangesAsync() > 0;
                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendance");
            }
        }
    }
}