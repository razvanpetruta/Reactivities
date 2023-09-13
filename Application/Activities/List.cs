using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<PagedList<ActivityDTO>>>
        {
            public ActivityParams Params { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDTO>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _mapper = mapper;
                _context = context;
            }

            public async Task<Result<PagedList<ActivityDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                IQueryable<ActivityDTO> query = _context.Activities
                    .Where(a => a.Date >= request.Params.StartDate)
                    .OrderBy(a => a.Date)
                    .ProjectTo<ActivityDTO>(_mapper.ConfigurationProvider, new { authenticatedUsername = _userAccessor.GetUsername() })
                    .AsQueryable();

                if (request.Params.IsGoing && !request.Params.IsHost)
                    query = query.Where(a => a.Attendees.Any(x => x.Username == _userAccessor.GetUsername()));
                
                if (request.Params.IsHost && !request.Params.IsGoing)
                    query = query.Where(a => a.HostUsername == _userAccessor.GetUsername());

                return Result<PagedList<ActivityDTO>>.Success(
                    await PagedList<ActivityDTO>
                        .CreateAsync(query, request.Params.PageNumber, request.Params.PageSize)
                );
            }
        }
    }
}