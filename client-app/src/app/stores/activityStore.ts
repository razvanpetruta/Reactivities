import { makeAutoObservable, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";
import { IUser } from "../models/user";

export default class ActivityStore {
    activityRegistry: Map<string, Activity> = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode: boolean = false;
    loading: boolean = false;
    loadingInitial: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    get activitiesByDate(): Activity[] {
        return Array.from(this.activityRegistry.values()).sort(
            (a: Activity, b: Activity) => a.date!.getTime() - b.date!.getTime()
        );
    }

    get groupedActivities(): [string, Activity[]][] {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, "dd MM yyyy");
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as { [key: string]: Activity[] })
        );
    }

    loadActivities = async (): Promise<void> => {
        this.setLoadingInitial(true);
        try {
            const activities: Activity[] = await agent.Activities.list();
            activities.forEach((activity: Activity) => {
                this.setActivity(activity);
            });
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    };

    loadActivity = async (id: string): Promise<Activity | undefined> => {
        let activity: Activity | undefined = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return this.selectedActivity;
        }
        this.setLoadingInitial(true);
        try {
            activity = await agent.Activities.details(id);
            this.setActivity(activity);
            runInAction(() => {
                this.selectedActivity = activity;
            });
            this.setLoadingInitial(false);
            return activity;
        } catch (error) {
            this.setLoadingInitial(false);
            console.log(error);
        }
    };

    private setActivity = (activity: Activity): void => {
        const user: IUser | null = store.userStore.user;
        if (user) {
            activity.isGoing = activity.attendees!.some((profile: Profile) => profile.username === user.username);
            activity.isHost = activity.hostUsername === user.username;
            activity.host = activity.attendees?.find((profile: Profile) => profile.username === activity.hostUsername);
        }
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    };

    private getActivity = (id: string): Activity | undefined => {
        return this.activityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean): void => {
        this.loadingInitial = state;
    };

    createActivity = async (activity: ActivityFormValues): Promise<void> => {
        const user: IUser | null = store.userStore.user;
        const attendee: Profile = new Profile(user!);
        try {
            await agent.Activities.create(activity);
            const newActivity: Activity = new Activity(activity);
            newActivity.hostUsername = user!.username;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            runInAction(() => {
                this.selectedActivity = newActivity;
            });
        } catch (error) {
            console.log(error);
        }
    };

    updateActivity = async (activity: ActivityFormValues): Promise<void> => {
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                if (activity.id) {
                    const updatedActivity = { ...this.getActivity(activity.id), ...activity };
                    this.activityRegistry.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity = updatedActivity as Activity;
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    deleteActivity = async (id: string): Promise<void> => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.loading = false;
            });
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    updateAttendence = async (): Promise<void> => {
        const user: IUser | null = store.userStore.user;
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees =
                        this.selectedActivity.attendees?.filter((profile: Profile) => profile.username !== user?.username);
                    this.selectedActivity.isGoing = false;
                } else {
                    const attendee: Profile = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    };

    cancelActivityToggle = async (): Promise<void> => {
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCanceled = !this.selectedActivity?.isCanceled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    };

    deselectActivity = (): void => {
        this.selectedActivity = undefined;
    }
}