import { DialogComponent } from '@gsuite/shared/ui';
import {
  Stack, Typography,
  Checkbox,
  useTheme,
  FormControlLabel,
  IconButton,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { useUpdateCruceHistory } from '@gsuite/shared/services/cruces/update-history';
import { useUpdateStatusCruce } from '@gsuite/shared/services/cruces/cruce-update';
import { getIconImgeByExt } from '@gsuite/shared/utils/funcs';
import { READY_DOCUMENTS_STATUS } from '@gsuite/shared/seeders/status';
import { useTrafficDetail } from '@gsuite/shared/services/cruces/get-traffic-crossing-detail';
import { useCruceDetail } from '../services/cruce-detail';

type Props = {
  open: boolean;
  crossingId: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
};
export default function OfficeConfirmation({
  open,
  crossingId,
  setOpen,
}: Props) {
  const { t } = useTranslation();
  const [checked, setChecked] = useState<boolean>(false);
  const { data } = useTrafficDetail(crossingId);
  const theme = useTheme();
  const files = data?.getDispatchFolderFiles.nodes?.externalNode;
  const filesName = files?.filter((e) => !['0', 0].includes(e.parent)).map((n) => n?.data?.name);
  const onChangeCheckbox = () => setChecked(!checked);
  const { successMessage, errorMessage } = useSnackNotification();
  const handleClose = () => {
    setOpen(false);
    setChecked(false);
  };

  const { updateHistory } = useUpdateCruceHistory();
  const { updateStatusCrossing } = useUpdateStatusCruce();

  const { refetch } = useCruceDetail(crossingId);

  const handleSendDocuments = async (): Promise<void> => {
    try {
      await updateStatusCrossing({
        variables: { id: crossingId, status: READY_DOCUMENTS_STATUS },
        context: { clientName: 'globalization' },
      })
        .then(() => updateHistory({
          variables: {
            operation: {
              id: crossingId,
              action: 'document_send_traffic',
              files: filesName,
            },
          },
          context: { clientName: 'globalization' },
        })).then(() => refetch())
        .then(() => successMessage(t<string>('cruces.onSuccess.deliveredDocuments')));
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
      title="Confirmar envio a tráfico"
      open={open}
      handleClose={handleClose}
      handleConfirm={handleConfirm}
      okButtonVisibility={checked}
      cancelButtonVisibility
      okText={t<string>('cruces.send_to_traffic')}
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
        <Typography variant="inherit">¿Seguro que enviara la operacion a tráfico?</Typography>
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={onChangeCheckbox} />}
          label="Confirmo que todos los archivos estan listos para enviar a trafico"
        />
        <Stack direction="column" p={2}>
          <Stack direction="row" spacing={1} mt={2} alignItems="center">
            <FolderIcon sx={{ color: theme.palette.primary.main }} />
            <Typography sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
              Despacho
            </Typography>
          </Stack>
          <Stack
            direction="column"
            sx={{ minWidth: '100%', pl: 5 }}
            spacing={1}
          >
            {files?.filter((e) => !['0', 0].includes(e.parent)).map((data2) => (
              <Stack direction="row" sx={{ minWidth: '100%' }} alignItems="center" key={data2?.data?.name}>
                <IconButton
                  sx={{ pointerEvents: 'none' }}
                >
                  <img
                    src={getIconImgeByExt(data2?.data?.ext)}
                    alt="file"
                    height={30}
                    width={30}
                    draggable={false}
                  />
                </IconButton>
                {`${data2?.data?.name}.${data2?.data?.ext}`}
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </DialogComponent>
  );
}
