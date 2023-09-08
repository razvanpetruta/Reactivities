using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<Profiles.Profile>>>
        {
            public string Predicate { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext dataContext, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _dataContext = dataContext;
                _mapper = mapper;
            }

            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                List<Profiles.Profile> profiles = new List<Profiles.Profile>();

                switch (request.Predicate)
                {
                    case "followers":
                        profiles = await _dataContext.UserFollowings.Where(uf => uf.Target.UserName == request.Username)
                            .Select(uf => uf.Observer)
                            .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, new { authenticatedUsername = _userAccessor.GetUsername() })
                            .ToListAsync();
                        break;

                    case "following":
                        profiles = await _dataContext.UserFollowings.Where(uf => uf.Observer.UserName == request.Username)
                            .Select(uf => uf.Target)
                            .ProjectTo<Profiles.Profile>(_mapper.ConfigurationProvider, new { authenticatedUsername = _userAccessor.GetUsername() })
                            .ToListAsync();
                        break;
                }

                return Result<List<Profiles.Profile>>.Success(profiles);
            }
        }
    }
}