import { useContext, useState } from 'react';
import { debounce } from 'lodash';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { NotificationsContext } from '@/contexts/NotificationsContext';
import { useCancelOperation } from '../hooks/cancel-operation';

interface Props {
  isOpen: boolean;
  handleClick: () => void;
}

export default function CancelForm({ isOpen, handleClick }: Readonly<Props>) {
  const { cancelOperation } = useCancelOperation();
  const { id } = useParams();
  const [cancellationReason, setCancellationReason] = useState<string>('');
  const navigate = useNavigate();
  const { setSnackBar } = useContext(NotificationsContext);

  const handleSubmit = async () => {
    if (!id) return null;
    if (!cancellationReason) return setSnackBar('error', 'Debes de ingresar una motivo');
    try {
      await cancelOperation({
        variables: {
          operationId: id,
          cancellationReason,
        },
      });
      setSnackBar('success', 'Operación cancelada');
      handleClick();
      navigate(-1);
      return null;
    } catch (e) {
      return setSnackBar('error', 'Debes de tener permisos para cancelar una operación');
    }
  };

  return (
    <div>
      <Dialog open={isOpen}>
        <DialogTitle>¿Cual es el motivo de la cancelación?</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            onChange={debounce((e) => setCancellationReason(e.target.value), 200)}
            id="cancellationReason"
            label="Motivo de la cancelación"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClick}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
