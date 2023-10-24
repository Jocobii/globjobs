import {
  createContext,
  useState,
  useRef,
  useContext,
} from 'react';
import { Dialog } from '@mui/material';

type ChildrenProp = {
  children: Array<JSX.Element> | JSX.Element
};

type DialogContainerProps = {
  open: boolean;
  onClose: () => void;
  onKill: () => void;
} & ChildrenProp;

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
export function openFunc({ _ = undefined }: any) {}
export const closeFunc = () => {};

export const DialogContext = createContext([
  openFunc as (param: { children: JSX.Element | Array<JSX.Element> }) => void,
  closeFunc as () => void,
]);

export function DialogContainer({
  open,
  onKill,
  onClose,
  children,
}: DialogContainerProps) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        onKill();
      }}
      maxWidth="xl"
      disableEnforceFocus
    >
      {children}
    </Dialog>
  );
}

export function DialogProvider({ children }: ChildrenProp) {
  const [dialogs, setDialogs] = useState<any[]>([]);

  const createDialog = (option: any) => {
    const dialog = { ...option, open: true };
    setDialogs((ds) => [...ds, dialog]);
  };

  const closeDialog = () => {
    setDialogs((ds) => {
      const latestDialog = ds.pop();
      if (!latestDialog) return ds;
      if (latestDialog.onClose) latestDialog.onClose();
      return [...ds].concat({ ...latestDialog, open: false });
    });
  };
  const contextValue = useRef([createDialog, closeDialog]);

  return (
    <DialogContext.Provider value={contextValue.current as any}>
      {children}
      {
        dialogs.map((dialog) => {
          const { onClose, ...dialogParams } = dialog;
          const handleKill = () => {
            if (dialog.onExited) dialog.onExited();
            setDialogs((ds) => ds.slice(0, ds.length - 1));
          };

          return (
            <DialogContainer
              onClose={closeDialog}
              onKill={handleKill}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...dialogParams}
            />
          );
        })
      }
    </DialogContext.Provider>
  );
}

export const useDialog = () => useContext(DialogContext) as unknown as [
  ({ children }: { children: JSX.Element | Array<JSX.Element> }) => void,
  () => void,
];

export default DialogProvider;
