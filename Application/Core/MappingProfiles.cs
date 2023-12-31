using Application.Activities;
using Application.Comments;
using Application.Notifications;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string authenticatedUsername = null;

            CreateMap<Activity, Activity>();

            CreateMap<Activity, ActivityDTO>()
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees
                    .FirstOrDefault(au => au.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDTO>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(photo => photo.IsMain).Url))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.AppUser.Followers.Count()))
                .ForMember(d => d.FollowingsCount, o => o.MapFrom(s => s.AppUser.Followings.Count()))
                .ForMember(d => d.Following, o => o.MapFrom(s => s.AppUser.Followers.Any(uf => uf.Observer.UserName == authenticatedUsername)));

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(photo => photo.IsMain).Url))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count()))
                .ForMember(d => d.FollowingsCount, o => o.MapFrom(s => s.Followings.Count()))
                .ForMember(d => d.Following, o => o.MapFrom(s => s.Followers.Any(uf => uf.Observer.UserName == authenticatedUsername)));

            CreateMap<Comment, CommentDTO>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(photo => photo.IsMain).Url));

            CreateMap<ActivityAttendee, Profiles.UserActivityDTO>()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Activity.Id))
                .ForMember(d => d.Title, o => o.MapFrom(s => s.Activity.Title))
                .ForMember(d => d.Category, o => o.MapFrom(s => s.Activity.Category))
                .ForMember(d => d.Date, o => o.MapFrom(s => s.Activity.Date))
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Activity.Attendees.FirstOrDefault(aa => aa.IsHost).AppUser.UserName));
        
            CreateMap<Notification, NotificationDTO>()
                .ForMember(d => d.RecipientUsername, o => o.MapFrom(s => s.Recipient.UserName))
                .ForMember(d => d.RecipientDisplayName, o => o.MapFrom(s => s.Recipient.DisplayName))
                .ForMember(d => d.SenderUsername, o => o.MapFrom(s => s.Sender.UserName))
                .ForMember(d => d.SenderDisplayName, o => o.MapFrom(s => s.Sender.DisplayName));
        }
    }
}