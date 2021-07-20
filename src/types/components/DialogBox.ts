export type DialogBoxAction = {
  buttonContent: string;
  buttonClass: string;
  onClick: Function;
};

export type DialogConfig = {
  dialogBoxId?: string;
  dialogBoxContent?: {
    title?: string;
    content?: string;
  };
  config?: {
    closeOnEsc?: boolean;
    clickOutsideToClose?: boolean;
    fullscreen?: boolean;
  };
  dialogBoxActions?: Array<DialogBoxAction>;
};
