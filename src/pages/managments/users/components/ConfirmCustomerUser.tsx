import { Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '@/components';

type Props = {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
  userName: string;
  companies: string[];
  email: string;
};

export default function ConfirmCustomerUser({
  open,
  handleClose,
  handleConfirm,
  userName,
  companies,
  email,
}: Props) {
  const { t } = useTranslation();
  return (
    <DialogComponent
      open={open}
      maxWidth="xs"
      title={t('managements.createUser')}
      handleClose={handleClose}
      handleConfirm={handleConfirm}
    >
      <Stack direction="column" spacing={2}>
        <Typography variant="body1" color="primary">
          {t('managements.usersModule.createQuestion')}
        </Typography>
        <Typography variant="body1" color="textPrimary">
          {t('managements.user')}
          :
          {' '}
          {userName}
        </Typography>
        <Typography variant="body1" color="textPrimary">
          {t('managements.companies')}
          :
          {' '}
          {
            companies.map(
              (c) => (
                <Chip key={c} label={c} sx={{ m: 0.5 }} />
              ),
            )
          }
        </Typography>
        <Typography variant="body1" color="textPrimary">
          {t('managements.usersModule.emailMessage')}
        </Typography>
        <Typography variant="body1" color="primary">
          {email}
        </Typography>
      </Stack>
    </DialogComponent>
  );
}
