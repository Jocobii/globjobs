import { DialogComponent } from '@gsuite/shared/ui';
import { Typography, Box } from '@mui/material';

interface Props {
  open: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  loading?: boolean,
}

function ConfirmSendOperation({
  open,
  handleClose,
  handleSubmit,
  loading = false,
}: Props) {
  return (
    <DialogComponent
      title="Confirmar apertura de operacion"
      open={open}
      handleClose={handleClose}
      handleConfirm={handleSubmit}
      cancelText="Cancelar"
      okText="Generar operacion"
      loading={loading}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="body1" sx={{ margin: '10px' }}>¿Estas seguro que deseas generar la operacion?</Typography>
      </Box>
    </DialogComponent>
  );
}

export default ConfirmSendOperation;
