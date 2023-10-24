import { DialogComponent } from '@gsuite/shared/ui';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import { User } from '../types';
import { useToggleActiveUser } from '../api/toggleActivateUser';

interface Props {
  user: Partial<User>;
  open: boolean;
  handleClose: () => void;
}
export default function FormDialog({
  user, open, handleClose,
}: Props) {
  const { t } = useTranslation();
  const { mutateAsync: mutateAsyncToggleActiveUser } = useToggleActiveUser({ userId: user.id });
  const userName = `${user.name} ${user.lastName}`;
  const onSubmit = async () => {
    await mutateAsyncToggleActiveUser({ id: user?.id ?? '' }).catch(() => {});
    handleClose();
  };

  const nextStatus = user.active ? t('managements.disabled') : t('managements.enable');
  return (
    <DialogComponent
      title={`${nextStatus} ${t('managements.user')}`}
      open={open}
      handleClose={handleClose}
      cancelButtonVisibility={false}
      okButtonVisibility={false}
    >
      <DialogContentText sx={{ marginTop: '5px' }}>
        <Typography variant="body1" component="h2">
          {user.active ? t('managements.usersModule.userWillDisabled', { userName }) : t('managements.usersModule.userWillEnable', { userName }) }
        </Typography>
        <br />
        <Typography variant="h6" component="h2" sx={{ color: '#2196F3' }}>
          {user.active ? t('managements.usersModule.areUSureToDisabledUser') : t('managements.usersModule.areUSureToEnableUser')}
        </Typography>
      </DialogContentText>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained">
          {nextStatus}
          {' '}
          {t('managements.user')}
        </Button>
      </DialogActions>
    </DialogComponent>
  );
}
