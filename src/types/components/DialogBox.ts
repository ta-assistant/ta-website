export type DialogBox = {
  show: (config: DialogConfig) => void;
  dismiss: Function;
};

export type DialogBoxAction = {
  buttonContent: {
    value: string;
    isHTML: boolean;
  };
  buttonClass: string;
  onClick: Function;
};

export type DialogConfig = {
  dialogBoxContent: {
    title: {
      value: string;
      isHTML: boolean;
    };
    content: {
      value: string;
      isHTML: boolean;
    };
  };
  config: {
    closeOnEsc: boolean;
    clickOutsideToClose: boolean;
    fullscreen: boolean;
  };
  dialogBoxActions: Array<DialogBoxAction>;
};
