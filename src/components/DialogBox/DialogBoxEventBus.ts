import Vue from "vue";

const DialogBoxEventBus = new Vue();

export enum DialogEvent {
  show = "SHOW_DIALOG",
  dismiss = "DISMISS_DIALOG",
}

export type DialogEventResponse = {
  success: boolean;
  message?: string;
};
export default DialogBoxEventBus;
