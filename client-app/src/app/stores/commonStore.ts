import { makeAutoObservable, reaction } from "mobx";
import { IServerError } from "../models/serverError";

export default class CommonStore {
    error: IServerError | null = null;
    token: string | null = localStorage.getItem("jwt");
    appLoaded: boolean = false;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.token,
            token => {
                if (token) {
                    localStorage.setItem("jwt", token);
                } else {
                    localStorage.removeItem("jwt");
                }
            }
        )
    }

    setServerError(error: IServerError): void {
        this.error = error;
    }

    setToken = (token: string | null): void => {
        this.token = token;
    }

    setAppLoaded = (): void => {
        this.appLoaded = true;
    }
}