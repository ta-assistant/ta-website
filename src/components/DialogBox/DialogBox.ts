import DialogBoxEventBus, {
  DialogEvent,
  DialogEventResponse,
} from "./DialogBoxEventBus";
import { DialogConfig } from "@/types/components/DialogBox";

export class DialogBox {
  private _dialogBoxId: string;
  constructor(dialogBoxId: string) {
    this._dialogBoxId = dialogBoxId;
  }

  show(dialogConfig: DialogConfig): void {
    dialogConfig = this._checkDialogBoxId(dialogConfig ?? {});
    dialogConfig = this._parseDialogConfig(dialogConfig);
    const responseChannelId = `RESPONSE-${dialogConfig.dialogBoxId}`;
    DialogBoxEventBus.$emit(DialogEvent.show, dialogConfig);
    this._listenResponse(responseChannelId);
  }

  dismiss(dialogConfig?: DialogConfig): void {
    dialogConfig = this._checkDialogBoxId(dialogConfig ?? {});
    const responseChannelId = `RESPONSE-${dialogConfig.dialogBoxId}`;
    DialogBoxEventBus.$emit(DialogEvent.dismiss, dialogConfig);
    this._listenResponse(responseChannelId);
  }

  private _listenResponse(responseChannelId: string): void {
    DialogBoxEventBus.$on(
      responseChannelId,
      (response: DialogEventResponse) => {
        if (!response.success) {
          throw Error(response.message);
        }

        DialogBoxEventBus.$off(responseChannelId);
      }
    );
  }

  private _checkDialogBoxId(dialogConfig: DialogConfig): DialogConfig {
    if (typeof dialogConfig.dialogBoxId === "undefined") {
      if (this._dialogBoxId !== null) {
        dialogConfig.dialogBoxId = this._dialogBoxId;
      } else {
        throw Error("The DialogBoxId must be specified");
      }
    }
    return dialogConfig;
  }

  private _parseDialogConfig(dialogConfig: DialogConfig): DialogConfig {
    if (typeof dialogConfig.config === "undefined") {
      dialogConfig.config = {
        closeOnEsc: false,
        clickOutsideToClose: false,
        fullscreen: false,
      };
    } else {
      dialogConfig.config.closeOnEsc = dialogConfig.config.closeOnEsc ?? false;
      dialogConfig.config.clickOutsideToClose =
        dialogConfig.config.clickOutsideToClose ?? false;
      dialogConfig.config.fullscreen = dialogConfig.config.fullscreen ?? false;
    }

    if (typeof dialogConfig.dialogBoxActions === "undefined") {
      dialogConfig.dialogBoxActions = [
        {
          buttonContent: "Close",
          buttonClass: "md-primary",
          onClick: (): void => {
            this.dismiss();
          },
        },
      ];
    }
    return dialogConfig;
  }
}
