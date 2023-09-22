export enum Type {
    StartedFollowing,
    JoinedActivity,
    LeftActivity,
    ActivityHasBeenUpdated,
    ActivityHasBeenCanceled,
    ActivityHasBeenReactivated
};

export interface INotification {
    id: string;
    recipientUsername: string;
    recipientDisplayName: string;
    senderUsername: string;
    senderDisplayName: string;
    type: Type;
    date: Date;
    isRead: boolean;
    activityId?: string;
}