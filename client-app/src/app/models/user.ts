import { INotification } from "./notification";

export interface IUser {
    username: string;
    displayName: string;
    token: string;
    image?: string;
    notifications: INotification[];
}

export interface IUserFormValues {
    email: string;
    password: string;
    displayName?: string;
    username?: string;
}