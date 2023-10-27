import { useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import DialogComponent from '@gsuite/shared/ui/DialogComponent';

import {
  Raet, Rplbet, CollectionTransport, ReceivedUsaWarehouse,
} from './forms';

type Props = {
  open: boolean;
  handleClose: () => void;
  handleCreateOperation: () => void;
};
enum Option {
  RPLBET = 'RPLBET',
  RAET = 'RAET',
  ACT = 'ACT',
  SDET = 'SDET',
  SELECT = 'SELECT',
}

export default function SelectOperation({ open, handleClose, handleCreateOperation }: Props) {
  const [option, setOption] = useState<Option>(Option.SELECT);
  const { t } = useTranslation();

  const operationOptions = [
    {
      id: Option.RPLBET,
      text: t('broker.RPLBET'),
    },
    {
      id: Option.RAET,
      text: t('broker.RAET'),
    },
    {
      id: Option.ACT,
      text: t('broker.ACT'),
    },
    {
      id: Option.SDET,
      text: t('broker.SDET'),
    },
  ];

  const formCloseHandler = async () => {
    handleClose();
    setOption(Option.SELECT);
  };

  const operation = {
    RPLBET: {
      title: t('broker.RPLBET'),
      body: <Rplbet
        handleClose={formCloseHandler}
        handleCreateOperation={handleCreateOperation}
      />,
    },
    RAET: {
      title: t('broker.RAET'),
      body: <Raet
        handleClose={formCloseHandler}
        handleCreateOperation={handleCreateOperation}
      />,
    },
    ACT: {
      title: t('broker.ACT'),
      body: <CollectionTransport
        onClose={formCloseHandler}
        isCreateOperation
        handleCreateOperation={handleCreateOperation}
      />,
    },
    SDET: {
      title: t('broker.SDET'),
      body: <ReceivedUsaWarehouse onClose={formCloseHandler} isCreateOperation isEdit={false} />,
    },
    SELECT: {
      title: t('broker.requestOperation'),
      body: (
        <Stack spacing={2} alignContent="center">
          <Typography variant="subtitle1" align="center">
            {t('broker.selectOperation')}
          </Typography>
          {operationOptions.map(({ id, text }) => (
            <Button
              key={id}
              variant="contained"
              color="warning"
              sx={{ alignContent: 'left' }}
              onClick={() => setOption(Option[id])}
            >
              {text}
            </Button>
          ))}
        </Stack>
      ),
    },
  };

  return (
    <DialogComponent
      title={operation[Option[option]].title}
      open={open}
      maxWidth="xl"
      cancelButtonVisibility={false}
      okButtonVisibility={false}
      handleClose={handleClose}
    >
      {operation[Option[option]].body}
    </DialogComponent>
  );
}
