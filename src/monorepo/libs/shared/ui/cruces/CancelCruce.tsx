import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  Typography,
  DialogActions,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useSnackNotification } from '@gsuite/shared/hooks';
import { TFunctionType } from '@gsuite/typings/common';
import { getUserSession } from '@gsuite/shared/contexts/AuthContext';
import { useCancelCrossing } from '@gsuite/shared/services/cruces/cruce-cancel';

type Props = {
  open: boolean;
  handleVisibility: (prop: boolean) => void;
  title: string;
  crossingId: string;
  t: TFunctionType;
  redirectUrl: string;
};

export default function CancelCruceModal({
  open,
  handleVisibility,
  title,
  crossingId,
  t,
  redirectUrl,
}: Props) {
  const { showSnackMessage, errorMessage } = useSnackNotification();
  const [handleCancelCrossing] = useCancelCrossing();
  const navigate = useNavigate();

  const handleClose = () => {
    handleVisibility(false);
  };

  const handleCancel = async () => {
    const getUser = await getUserSession();
    await handleCancelCrossing({
      variables: {
        crossingId,
        userId: getUser?.user?.id,
      },
    }).then(() => {
      showSnackMessage(
        t<string>('cruces.cancellation.cancelled', { operation: title }),
        'error',
        {
          vertical: 'top',
          horizontal: 'right',
        },
        2000,
        () => {
          navigate(redirectUrl);
        },
      );
      handleClose();
    })
      .catch((error) => {
        errorMessage(error.message);
      });
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleVisibility(false)}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent style={{ textAlign: 'center' }}>
        <Typography variant="h4" style={{ color: '#2F82E0' }}>
          {t<string>('cruces.cancellation.alert')}
        </Typography>
        <DialogContentText>
          {t<string>('cruces.cancellation.disclaimer')}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>{t<string>('cruces.cancellation.deny')}</Button>
        <Button variant="contained" onClick={handleCancel}>{t<string>('cruces.cancellation.accept')}</Button>
      </DialogActions>
    </Dialog>
  );
}
