using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
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
                AppUser user = await _dataContext.Users
                    .Include(user => user.Photos)
                    .FirstOrDefaultAsync(user => user.UserName == _userAccessor.GetUsername());
                if (user == null)
                    return null;
                
                Photo photo = user.Photos.FirstOrDefault(photo => photo.Id == request.Id);
                if (photo == null)
                    return null;

                Photo currentMain = user.Photos.FirstOrDefault(photo => photo.IsMain);
                if (currentMain == null)
                    return null;

                currentMain.IsMain = false;
                photo.IsMain = true;

                bool success = await _dataContext.SaveChangesAsync() > 0;
                if (success)
                    return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem setting main photo");
            }
        }
    }
}