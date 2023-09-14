import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { IChatComment } from "../models/comment";
import { makeAutoObservable, runInAction } from "mobx";
import { store } from "./store";

export default class CommentStore {
    comments: IChatComment[] = [];
    hubConnection: HubConnection | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    createHubConnection = (activityId: string): void => {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_CHAT_URL}?activityId=${activityId}`, {
                accessTokenFactory: () => store.userStore.user?.token as string
            })
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        this.hubConnection.start().catch(error => console.log("Error establishing connection: ", error));

        this.hubConnection.on("LoadComments", (comments: IChatComment[]) => {
            runInAction(() => {
                comments.forEach((comment: IChatComment) => {
                    comment.createdAt = new Date(comment.createdAt);
                });
                this.comments = comments;
            });
        });

        this.hubConnection.on("ReceiveComment", (comment: IChatComment) => {
            runInAction(() => {
                comment.createdAt = new Date(comment.createdAt);
                this.comments.unshift(comment);
            });
        });
    }

    stopHubConnection = (): void => {
        this.hubConnection?.stop().catch(error => console.log("Error stopping connection: ", error));
    }

    clearComments = (): void => {
        this.comments = [];
        this.stopHubConnection();
    }

    addComment = async (values: { body: string, activityId?: string }) => {
        values.activityId = store.activityStore.selectedActivity?.id;
        try {
            await this.hubConnection?.invoke("SendComment", values);
        } catch (error) {
            console.log(error);
        }
    }
}