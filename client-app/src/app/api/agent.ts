import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { Activity, ActivityFormValues } from "../models/activity";
import { toast } from "react-toastify";
import { router } from "../router/Routes";
import { store } from "../stores/store";
import { IUser, IUserFormValues } from "../models/user";
import { IPhoto, IUserActivity, Profile } from "../models/profile";
import { PaginatedResult } from "../models/pagination";

const sleep = (delay: number): Promise<unknown> => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token: string | null = store.commonStore.token;
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

axios.interceptors.response.use(
    async (response: AxiosResponse): Promise<AxiosResponse> => {
        if (import.meta.env.DEV)
            await sleep(1000);
        const pagination = response.headers["pagination"];
        if (pagination) {
            response.data = new PaginatedResult(response.data, JSON.parse(pagination));
            return response as AxiosResponse<PaginatedResult<unknown>>;
        }
        return response;
    },
    (error: AxiosError): Promise<void> => {
        const { data, status, config, headers } = error.response as AxiosResponse;
        switch (status) {
            case 400:
                if (config.method === "get" && Object.prototype.hasOwnProperty.call(data.errors, "id")) {
                    router.navigate("/not-found");
                }
                if (data.errors) {
                    const modalStateErrors = [];
                    for (const key in data.errors) {
                        if (data.errors[key]) {
                            modalStateErrors.push(data.errors[key]);
                        }
                    }
                    throw modalStateErrors.flat();
                } else {
                    toast.error(data);
                }
                break;
            case 401:
                if (status === 401 && headers["www-authenticate"]?.startsWith("Bearer error=\"invalid_token")) {
                    store.userStore.logout();
                    toast.error("Session expired - please login again");
                } else {
                    toast.error("unauthorized");
                }
                break;
            case 403:
                toast.error("forbidden");
                break;
            case 404:
                router.navigate("/not-found");
                break;
            case 500:
                store.commonStore.setServerError(data);
                router.navigate("/server-error");
                break;
        }
        return Promise.reject(error);
    }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: object) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: object) => axios.put<T>(url, body).then(responseBody),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseBody)
};

const Activities = {
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>("/activities", { params: params })
        .then(responseBody),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>("/activities", activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.delete<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {})
};

const Accounts = {
    current: () => requests.get<IUser>("/account"),
    login: (user: IUserFormValues) => requests.post<IUser>("/account/login", user),
    register: (user: IUserFormValues) => requests.post<IUser>("/account/register", user),
    refreshToken: () => requests.post<IUser>("/account/refreshToken", {}),
    verifyEmail: (token: string, email: string) =>
        requests.post<void>(`/account/verifyEmail?token=${token}&email=${email}`, {}),
    resendEmailConfirmation: (email: string) =>
        requests.get(`/account/resendEmailConfirmationLink?email=${email}`),
    forgotPassword: (email: string) => requests.post<void>(`/account/forgotPassword?email=${email}`, {}),
    resetPassword: (token: string, email: string, newPassword: string) =>
        requests.post<void>(`/account/resetPassword?token=${token}&email=${email}`, { newPassword: newPassword })
};

const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    uploadPhoto: (file: Blob) => {
        const formData = new FormData();
        formData.append("File", file);

        return axios.post<IPhoto>("/photos", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    },
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.delete(`/photos/${id}`),
    updateProfile: (profile: Partial<Profile>) => requests.put(`/profiles`, profile),
    updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
    listFollowings: (username: string, predicate: string) => requests.get<Profile[]>(`/follow/${username}?predicate=${predicate}`),
    listActivities: (username: string, predicate: string) => requests.get<IUserActivity[]>(`/profiles/${username}/activities?predicate=${predicate}`)
};

const agent = {
    Activities,
    Accounts,
    Profiles
};

export default agent;