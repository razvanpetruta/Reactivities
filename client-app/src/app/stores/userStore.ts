import { makeAutoObservable, runInAction } from "mobx";
import { IUser, IUserFormValues } from "../models/user";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Routes";

export default class UserStore {
    user: IUser | null = null;
    refreshTokenTimeout?: NodeJS.Timeout;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn(): boolean {
        return this.user !== null;
    }

    login = async (credentials: IUserFormValues): Promise<void> => {
        try {
            const user: IUser = await agent.Accounts.login(credentials);
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
            runInAction(() => this.user = user);
            router.navigate("/activities");
            store.modalStore.closeModal();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    register = async (credentials: IUserFormValues): Promise<void> => {
        try {
            const user: IUser = await agent.Accounts.register(credentials);
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
            runInAction(() => this.user = user);
            router.navigate("/activities");
            store.modalStore.closeModal();
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    logout = (): void => {
        store.commonStore.setToken(null);
        store.activityStore.resetStore();
        this.user = null;
        router.navigate("/");
    }

    getUser = async (): Promise<void> => {
        try {
            const user: IUser = await agent.Accounts.current();
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
            runInAction(() => this.user = user);
        } catch (error) {
            console.log(error);
        }
    }

    setImage = (image: string): void => {
        if (!this.user)
            return;

        this.user.image = image;
    }

    setDisplayName = (name: string) => {
        if (!this.user)
            return;

        this.user.displayName = name;
    }

    refreshToken = async () => {
        this.stopRefreshTokenTimer();
        try {
            const user = await agent.Accounts.refreshToken();
            runInAction(() => this.user = user);
            store.commonStore.setToken(user.token);
            this.startRefreshTokenTimer(user);
        } catch (error) {
            console.log(error);
        }
    }

    private startRefreshTokenTimer(user: IUser) {
        const jwtToken = JSON.parse(atob(user.token.split(".")[1]));
        const expires = new Date(jwtToken.exp * 1000);
        const timeout = expires.getTime() - Date.now() - (30 * 1000);
        this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}