using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Update
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string DisplayName { get; set; }
            public string Bio { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(p => p.DisplayName).NotEmpty();
            }
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
                AppUser user = await _dataContext.Users.FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());
                if (user == null)
                    return null;

                user.DisplayName = request.DisplayName;
                user.Bio = request.Bio ?? user.Bio;

                _dataContext.Users.Update(user);
                bool success = await _dataContext.SaveChangesAsync() > 0;

                if (success)
                    return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem updating profile");
            }
        }
    }
}