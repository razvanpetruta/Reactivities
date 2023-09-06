using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<Result<Profile>>
        {
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Profile>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _dataContext;
            public Handler(DataContext dataContext, IMapper mapper)
            {
                _dataContext = dataContext;
                _mapper = mapper;
            }

            public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                Profile user = await _dataContext.Users
                    .ProjectTo<Profile>(_mapper.ConfigurationProvider)
                    .SingleOrDefaultAsync(u => u.Username == request.Username);

                return Result<Profile>.Success(user);
            }
        }
    }
}