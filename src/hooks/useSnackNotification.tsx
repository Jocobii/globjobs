import {
  useSnackbar, SnackbarOrigin, BaseVariant, SnackbarKey,
} from 'notistack';

type onExited = (node: HTMLElement, key: SnackbarKey) => void | undefined;

const defaultPosition: SnackbarOrigin = {
  vertical: 'top',
  horizontal: 'right',
};

function useSnackNotification() {
  const { enqueueSnackbar } = useSnackbar();

  const showSnackMessage = (
    message: string,
    type: BaseVariant,
    position: SnackbarOrigin = defaultPosition,
    duration = 4000,
    onExited?: onExited,
  ) => {
    enqueueSnackbar(message, {
      variant: type,
      autoHideDuration: duration,
      anchorOrigin: { ...position },
      ...(onExited && { onExited }),
    });
  };

  const successMessage = (
    message: string,
    position?: SnackbarOrigin,
    duration?: number,
  ) => showSnackMessage(message, 'success', position, duration);

  const errorMessage = (
    message: string,
    position?: SnackbarOrigin,
    duration?: number,
  ) => showSnackMessage(message, 'error', position, duration);

  const warningMessage = (
    message: string,
    position?: SnackbarOrigin,
    duration?: number,
  ) => showSnackMessage(message, 'warning', position, duration);

  const infoMessage = (
    message: string,
    position?: SnackbarOrigin,
    duration?: number,
  ) => showSnackMessage(message, 'info', position, duration);

  return {
    showSnackMessage,
    successMessage,
    errorMessage,
    warningMessage,
    infoMessage,
  };
}

export default useSnackNotification;
