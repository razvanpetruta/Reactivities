using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<Result<CommentDTO>>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Body).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<CommentDTO>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly DataContext _dataContext;
            public Handler(DataContext dataContext, IMapper mapper, IUserAccessor userAccessor)
            {
                _dataContext = dataContext;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<CommentDTO>> Handle(Command request, CancellationToken cancellationToken)
            {
                Activity activity = await _dataContext.Activities.FindAsync(request.ActivityId);
                if (activity == null)
                    return null;

                AppUser user = await _dataContext.Users
                    .Include(u => u.Photos)
                    .SingleOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());
                if (user == null)
                    return null;

                Comment comment = new Comment
                {
                    Author = user,
                    Activity = activity,
                    Body = request.Body
                };
                activity.Comments.Add(comment);

                bool success = await _dataContext.SaveChangesAsync() > 0;
                if (success)
                    return Result<CommentDTO>.Success(_mapper.Map<CommentDTO>(comment));
                
                return Result<CommentDTO>.Failure("Failed to add comment");
            }
        }
    }
}