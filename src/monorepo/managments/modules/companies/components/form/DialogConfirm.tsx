import DialogComponent from '@gsuite/shared/ui/DialogComponent';
import { Stack, Typography } from '@mui/material';

type Props = {
  open: boolean;
  handleClose: () => void;
  handleSuccess: () => void;
  name: string;
};
export default function DialogConfirm({
  open,
  handleClose,
  handleSuccess,
  name,
}: Props) {
  return (
    <DialogComponent
      title="Editar Cliente"
      open={open}
      maxWidth="xl"
      cancelButtonVisibility
      okButtonVisibility
      okText="Editar Cliente"
      handleClose={handleClose}
      handleConfirm={handleSuccess}
    >
      <Stack spacing={2}>
        <Typography variant="h6">
          El cliente
          {name}
          {' '}
          sera editado
        </Typography>
        <Typography variant="body1">¿Estas seguro que quieres editar el cliente?</Typography>
      </Stack>
    </DialogComponent>
  );
}
