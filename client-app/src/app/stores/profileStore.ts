import { makeAutoObservable, runInAction } from "mobx";
import { IPhoto, Profile } from "../models/profile";
import agent from "../api/agent";
import { store } from "./store";
import { AxiosResponse } from "axios";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile: boolean = false;
    uploading: boolean = false;
    loading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.username === this.profile.username;
        }

        return false;
    }

    loadProfile = async (username: string): Promise<void> => {
        this.loadingProfile = true;
        try {
            const profile: Profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loadingProfile = false);
        }
    }

    uploadPhoto = async (file: Blob): Promise<void> => {
        this.uploading = true;
        try {
            const response: AxiosResponse<IPhoto, any> = await agent.Profiles.uploadPhoto(file);
            const photo: IPhoto = response.data;
            runInAction(() => {
                if (!this.profile)
                    return;

                this.profile.photos?.push(photo);
                if (photo.isMain && store.userStore.user) {
                    store.userStore.setImage(photo.url);
                    this.profile.image = photo.url;
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.uploading = false);
        }
    }

    setMainPhoto = async (photo: IPhoto): Promise<void> => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id == photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    deletePhoto = async (photo: IPhoto) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                if (!this.profile)
                    return;

                this.profile.photos = this.profile.photos?.filter((p: IPhoto) => p.id !== photo.id);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    updateProfile = async (profile: Partial<Profile>) => {
        try {
            await agent.Profiles.updateProfile(profile);
            runInAction(() => {
                if (profile.displayName && profile.displayName !== store.userStore.user?.displayName) {
                    store.userStore.setDisplayName(profile.displayName);
                }
                this.profile = { ...this.profile, ...profile as Profile };
            });
        } catch (error) {
            console.log(error);
        }
    }
};