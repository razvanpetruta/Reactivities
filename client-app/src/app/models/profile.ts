import { IUser } from "./user";

export interface IProfile {
    username: string;
    displayName: string;
    image?: string;
    bio?: string;
    followersCount: number;
    followingsCount: number;
    following: boolean;
    photos?: IPhoto[];
};

export class Profile implements IProfile {
    username: string;
    displayName: string;
    image?: string;
    bio?: string;
    followersCount: number = 0;
    followingsCount: number = 0;
    following: boolean = false;
    photos?: IPhoto[];

    constructor(user: IUser) {
        this.username = user.username;
        this.displayName = user.displayName;
        this.image = user.image;
    }
};

export interface IPhoto {
    id: string;
    url: string;
    isMain: boolean;
};