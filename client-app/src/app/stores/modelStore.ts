import { makeAutoObservable } from "mobx";

interface Modal {
    open: boolean;
    body: JSX.Element | null;
}

export default class ModalStore {
    modal: Modal = {
        open: false,
        body: null
    };

    constructor() {
        makeAutoObservable(this);
    }

    openModal = (content: JSX.Element): void => {
        this.modal.open = true;
        this.modal.body = content;
    }

    closeModal = (): void => {
        this.modal.open = false;
        this.modal.body = null;
    }
}