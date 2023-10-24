import { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import get from 'lodash/get';

import { NodeModels } from '@gsuite/typings/files';
import { useCrossing } from '@gsuite/shared/contexts';
import { DOCUMENTS_DELIVERED_STATUS } from '@gsuite/shared/seeders';
import { DialogComponent } from '@gsuite/shared/ui';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { useUpdateCruce } from '@gsuite/shared/services/cruces/cruce-update';
import { useUpdateCruceHistory } from '@gsuite/shared/services/cruces/update-history';

import { useCruceDetail } from '../services/cruce-detail';

interface Props {
  open: boolean;
  handleClose: () => void;
  node: NodeModels,
}

export default function ModalIntegrationNumber({ open, handleClose, node }: Props) {
  const [value, setValue] = useState('');
  const { crossing, setCrossing } = useCrossing();
  const { updateCrossing } = useUpdateCruce();
  const { updateHistory } = useUpdateCruceHistory();
  const { successMessage, errorMessage } = useSnackNotification();
  const { _id: idStatus } = crossing?.status ?? {};
  const { refetch } = useCruceDetail(crossing?.id as string);

  const fileKey = get(node, 'data.file.key', 'file');
  const filename = fileKey.split('.')[1] ? fileKey : `${fileKey}.${get(node, 'data.ext', 'pdf')}`;

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => setValue(newValue);

  const onClose = () => {
    setValue('');
    handleClose();
  };

  const updateHistoryStatus = async (type: string) => updateHistory({
    variables: {
      operation: {
        id: crossing?.id,
        action: type.toLowerCase() === 'rojo' ? 'red_modulation_update' : 'green_modulation_update',
        files: filename,
      },
    },
    context: { clientName: 'globalization' },
  });

  const updateModulationType = async () => {
    await updateCrossing({
      variables: {
        crossing: {
          ...crossing,
          typeModulation: value,
        },
      },
      context: { clientName: 'globalization' },
      onCompleted: async () => {
        await updateHistoryStatus(value);
        setCrossing({
          ...crossing,
          typeModulation: value,
        });
        refetch();
        successMessage('Modulacion actualizada correctamente');
        onClose();
      },
      onError: () => {
        errorMessage('Error al actualizar la modulacion');
        onClose();
      },
    });
  };

  if (idStatus !== DOCUMENTS_DELIVERED_STATUS) return null;

  return (
    <DialogComponent
      title="Modulación manual"
      open={open}
      handleClose={handleClose}
      handleConfirm={updateModulationType}
    >
      <Typography variant="body1" sx={{ margin: 5 }}>Revisa el estatus del cruce en la ventana emergente</Typography>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h6" sx={{ marginBottom: 2 }}>Selecciona el tipo de modulacion</Typography>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" TabIndicatorProps={{ style: { display: 'none' } }}>
          <Tab
            label="Rojo"
            value="rojo"
            sx={{
              borderRadius: '80px 0px 0px 80px',
              padding: '10px',
              border: '1px solid #9CC7F3',
              borderRightColor: 'transparent',
              marginRight: '0px !important',
              paddingX: 5,
            }}
          />
          <Tab
            label="Verde"
            value="verde"
            sx={{
              borderRadius: '0px 80px 80px 0px',
              padding: '10px',
              border: '1px solid #9CC7F3',
              borderLeftColor: 'transparent',
              paddingX: 5,
            }}
          />
        </Tabs>
      </Grid>
    </DialogComponent>
  );
}
