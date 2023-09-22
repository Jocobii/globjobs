import {
  createContext,
  useMemo,
  useReducer,
  ReactNode,
} from 'react';

interface ContextProps {
  children: ReactNode;
}

type State = {
  snackBarOpen: boolean;
  snackBarType: 'error' | 'warning' | 'info' | 'success';
  snackBarMessage: string | null;
  duration?: number;
};

type Action =
  | {
    type: 'SET_SNACKBAR';
    payload: State;
  }
  | {
    type: 'REMOVE_SNACKBAR';
  };

type NotificationsContextValue = {
  setSnackBar: (type: 'error' | 'warning' | 'info' | 'success', message: string, duration?: number) => void;
  removeSnackBar: () => void;
} & State;

const initialState: State = {
  snackBarOpen: false,
  snackBarType: 'success',
  snackBarMessage: null,
  duration: 6000,
};

export const NotificationsContext = createContext<NotificationsContextValue>({
  ...initialState,
  setSnackBar: () => null,
  removeSnackBar: () => null,
});

const notificationsReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_SNACKBAR':
      return {
        ...action.payload,
      };
    case 'REMOVE_SNACKBAR':
      return {
        ...state,
        snackBarOpen: false,
        duration: 6000,
      };
    default:
      return state;
  }
};

export function NotificationsProvider({ children }: ContextProps) {
  const [state, dispatch] = useReducer(notificationsReducer, initialState);

  const setSnackBar = (type: 'error' | 'warning' | 'info' | 'success', message: string, duration?: number) => {
    dispatch({
      type: 'SET_SNACKBAR',
      payload: {
        snackBarOpen: true,
        snackBarMessage: message,
        snackBarType: type,
        ...(duration && { duration }),
      },
    });
  };

  const removeSnackBar = () => {
    dispatch({ type: 'REMOVE_SNACKBAR' });
  };

  const values = useMemo<NotificationsContextValue>(() => ({
    snackBarOpen: state.snackBarOpen,
    snackBarType: state.snackBarType,
    snackBarMessage: state.snackBarMessage,
    duration: state.duration,
    setSnackBar,
    removeSnackBar,
  }), [state]);

  return (
    <NotificationsContext.Provider value={values}>
      {children}
    </NotificationsContext.Provider>
  );
}
