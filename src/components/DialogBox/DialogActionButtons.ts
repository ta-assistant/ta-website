import { DialogBox, DialogBoxAction } from "@/types/components/DialogBox";
import firebase from "firebase";
import VueRouter from "vue-router";

export class DialogActionButtons {
  private _router: VueRouter;
  private _dialogBox: DialogBox;
  private _previousPath: string | undefined;

  constructor(router: VueRouter, dialogBox: DialogBox, previousPath?: string) {
    this._router = router;
    this._dialogBox = dialogBox;
    this._previousPath = previousPath;
  }

  signOutButton(): DialogBoxAction {
    return {
      buttonContent: {
        value: "sign-out",
        isHTML: false,
      },
      buttonClass: "md-primary",
      onClick: async () => {
        await firebase.auth().signOut();
        this._dialogBox.dismiss();
        this._router.push({ path: "/signIn" });
      },
    };
  }

  backButton(): DialogBoxAction {
    if (typeof this._previousPath === "undefined") {
      throw Error("The back button required the previousPath");
    }
    return {
      buttonContent: {
        value: "Back",
        isHTML: false,
      },
      buttonClass: "md-primary",
      onClick: () => {
        this._dialogBox.dismiss();
        this._router.push({
          path: this._previousPath,
        });
      },
    };
  }

  dismissButton(): DialogBoxAction {
    return {
      buttonContent: {
        value: "dismiss",
        isHTML: false,
      },
      buttonClass: "md-primary",
      onClick: () => {
        this._dialogBox.dismiss();
      },
    };
  }
}
