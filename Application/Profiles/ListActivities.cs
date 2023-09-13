using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDTO>>>
        {
            public string Username { get; set; }
            public string Predicate { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDTO>>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _dataContext;
            public Handler(DataContext dataContext, IMapper mapper)
            {
                _dataContext = dataContext;
                _mapper = mapper;
            }

            public async Task<Result<List<UserActivityDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                IQueryable<UserActivityDTO> query = _dataContext.ActivityAttendees
                    .Where(aa => aa.AppUser.UserName == request.Username)
                    .OrderBy(aa => aa.Activity.Date)
                    .ProjectTo<UserActivityDTO>(_mapper.ConfigurationProvider)
                    .AsQueryable();

                switch (request.Predicate) {
                    case "past":
                        query = query.Where(ua => ua.Date <= DateTime.Now);
                        break;

                    case "future":
                        query = query.Where(ua => ua.Date > DateTime.Now);
                        break;

                    case "hosting":
                        query = query.Where(ua => ua.HostUsername == request.Username);
                        break;
                }

                List<UserActivityDTO> activities = await query.ToListAsync();

                return Result<List<UserActivityDTO>>.Success(activities);
            }
        }
    }
}