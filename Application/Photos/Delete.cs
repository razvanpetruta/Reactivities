using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _dataContext;
            public Handler(DataContext dataContext, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _dataContext = dataContext;
                _userAccessor = userAccessor;
                _photoAccessor = photoAccessor;
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

                if (photo.IsMain)
                    return Result<Unit>.Failure("You cannot delete your main photo");

                string result = await _photoAccessor.DeletePhoto(photo.Id);
                if (result == null)
                    return Result<Unit>.Failure("Problem deleting photo from cloudinary");

                user.Photos.Remove(photo);
                bool success = await _dataContext.SaveChangesAsync() > 0;
                if (success)
                    return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem deleting photo from API");
            }
        }
    }
}