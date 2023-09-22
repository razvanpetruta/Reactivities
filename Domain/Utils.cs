namespace Domain
{
    public class Utils
    {
        public enum Type
        {
            StartedFollowing,
            JoinedActivity,
            LeftActivity,
            ActivityHasBeenUpdated,
            ActivityHasBeenCanceled,
            ActivityHasBeenReactivated
        }
    }
}