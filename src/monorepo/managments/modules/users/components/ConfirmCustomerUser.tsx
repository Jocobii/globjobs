import DialogComponent from '@gsuite/shared/ui/DialogComponent';
import { Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

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
      title={t<string>('managements.createUser')}
      handleClose={handleClose}
      handleConfirm={handleConfirm}
    >
      <Stack direction="column" spacing={2}>
        <Typography variant="body1" color="primary">
          {t<string>('managements.usersModule.createQuestion')}
        </Typography>
        <Typography variant="body1" color="textPrimary">
          {t<string>('managements.user')}
          :
          {' '}
          {userName}
        </Typography>
        <Typography variant="body1" color="textPrimary">
          {t<string>('managements.companies')}
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
          {t<string>('managements.usersModule.emailMessage')}
        </Typography>
        <Typography variant="body1" color="primary">
          {email}
        </Typography>
      </Stack>
    </DialogComponent>
  );
}
