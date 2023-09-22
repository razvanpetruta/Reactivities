using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Notifications
{
    public class List
    {
        public class Query : IRequest<Result<List<NotificationDTO>>>
        {
        }

        public class Handler : IRequestHandler<Query, Result<List<NotificationDTO>>>
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

            public async Task<Result<List<NotificationDTO>>> Handle(Query request, CancellationToken cancellationToken)
            {
                List<NotificationDTO> notifications = await _dataContext.Notifications
                    .Where(n => n.Recipient.UserName == _userAccessor.GetUsername())
                    .OrderByDescending(n => n.Date)
                    .ProjectTo<NotificationDTO>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                return Result<List<NotificationDTO>>.Success(notifications);
            }
        }
    }
}