import { DialogComponent } from '@gsuite/shared/ui';
import { Stack, Typography } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { useUpdateCruceHistory } from '@gsuite/shared/services/cruces/update-history';
import { useUpdateStatusCruce } from '@gsuite/shared/services/cruces/cruce-update';
import { DOCUMENTS_DELIVERED_STATUS } from '@gsuite/shared/seeders/status';

type Props = {
  open: boolean;
  crossingId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
};
export default function DocumentsDelivery({
  open,
  crossingId,
  setOpen,
}: Props) {
  const { t } = useTranslation();
  const { showSnackMessage, errorMessage } = useSnackNotification();
  const { updateHistory } = useUpdateCruceHistory();
  const navigate = useNavigate();
  const { updateStatusCrossing } = useUpdateStatusCruce();
  const handleClose = () => {
    setOpen(false);
  };
  const handleSendDocuments = async (): Promise<void> => {
    try {
      await updateStatusCrossing({
        variables: { id: crossingId, status: DOCUMENTS_DELIVERED_STATUS },
        context: { clientName: 'globalization' },
      })
        .then(() => updateHistory({
          variables: {
            operation: {
              id: crossingId,
              action: 'documents_delivered',
            },
          },
          context: { clientName: 'globalization' },
        }))
        .then(() => {
          showSnackMessage(
            t<string>('cruces.onSuccess.deliveredDocuments'),
            'success',
            {
              vertical: 'top',
              horizontal: 'right',
            },
            2000,
            () => {
              navigate('/t/operation/documentsDelivered');
            },
          );
        });
    } catch (error) {
      console.log(error);
      errorMessage(t<string>('cruces.an_error'));
    }
  };

  const handleConfirm = () => {
    handleSendDocuments();
    handleClose();
  };

  return (
    <DialogComponent
      title="Confirmar de entrega de documentos"
      open={open}
      handleClose={handleClose}
      handleConfirm={handleConfirm}
      doubleCheck
      doubleCheckText={t<string>('cruces.checked_text')}
      cancelButtonVisibility
      okText={t<string>('confirm')}
      fullWidth
      maxWidth="sm"
    >
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        sx={{ mt: '30px' }}
      >
        <Typography variant="h5" sx={{ color: '#2196F3' }}>¿Estas seguro que deseas entregar documentos?</Typography>
      </Stack>
    </DialogComponent>
  );
}
