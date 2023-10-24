import { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText,
} from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { LoadingButton } from '@mui/lab';
import _ from 'lodash';

type Variant = 'text' | 'outlined' | 'contained' | undefined;
type Props = {
  open?: boolean;
  handleClose?: () => void;
  handleConfirm?: () => void;
  title?: string;
  body?: string;
  children?: Array<JSX.Element> | JSX.Element | null | string;
  okText?: string;
  cancelText?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  okButtonVisibility?: boolean;
  cancelButtonVisibility?: boolean;
  fullWidth?: boolean;
  variantConfirm?: Variant;
  variantCancel?: Variant;
  doubleCheck?: boolean;
  doubleCheckText?: string;
  loading?: boolean;
};

export default function DialogComponent({
  open = false,
  handleClose = () => null,
  handleConfirm = () => null,
  title = '',
  body = '',
  children = null,
  okText = 'Confirm',
  cancelText = 'Cancel',
  maxWidth = 'xs',
  doubleCheck = false,
  doubleCheckText = 'Estoy seguro de esta accion',
  okButtonVisibility = true,
  cancelButtonVisibility = true,
  fullWidth = false,
  variantConfirm = 'contained',
  variantCancel = 'outlined',
  loading = undefined,
}: Props) {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <Dialog
      open={open}
      keepMounted={false}
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
      maxWidth={maxWidth}
      fullWidth={fullWidth}
    >
      {title && (
        <DialogTitle id="alert-dialog-slide-title" color="primary">
          {title}
        </DialogTitle>
      )}
      <DialogContent>
        {body && <DialogContentText id="alert-dialog-slide-description">{body}</DialogContentText>}
        {children}
        {!!doubleCheck && (
        <FormGroup>
          <FormControlLabel
            control={<Checkbox checked={checked} onChange={handleChange} />}
            label={doubleCheckText}
          />
        </FormGroup>
        )}
      </DialogContent>
      {(cancelButtonVisibility || okButtonVisibility) && (
        <DialogActions>
          {cancelButtonVisibility && (
            <Button onClick={handleClose} variant={variantCancel} color="primary">
              {cancelText}
            </Button>
          )}
          {okButtonVisibility && _.isNil(loading) && (
            <Button onClick={handleConfirm} disabled={doubleCheck && !checked} variant={variantConfirm} color="primary">
              {okText}
            </Button>
          )}
          {okButtonVisibility && !_.isNil(loading) && (
            <LoadingButton
              loading={loading}
              onClick={handleConfirm}
              disabled={doubleCheck && !checked}
              variant={variantConfirm}
              color="primary"
            >
              {okText}
            </LoadingButton>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}
