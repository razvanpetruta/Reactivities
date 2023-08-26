import { makeAutoObservable, runInAction } from "mobx";
import { User, UserFormValues } from "../models/user";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Routes";

export default class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return this.user !== null;
    }

    login = async (credentials: UserFormValues) => {
        try {
            const user = await agent.Accounts.login(credentials);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            router.navigate("/activities");
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }

    register = async (credentials: UserFormValues) => {
        try {
            const user = await agent.Accounts.register(credentials);
            store.commonStore.setToken(user.token);
            runInAction(() => this.user = user);
            router.navigate("/activities");
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }

    logout = () => {
        store.commonStore.setToken(null);
        this.user = null;
        router.navigate("/");
    }

    getUser = async () => {
        try {
            const user = await agent.Accounts.current();
            runInAction(() => this.user = user);
        } catch (error) {
            console.log(error);
        }
    }
}