import { useState, Suspense } from 'react';
import {
  Drawer, Stack, Typography, Switch, FormControlLabel,
} from '@mui/material';

import loadable from '@loadable/component';
import { useTranslation } from 'react-i18next';
import Conditional from '@gsuite/ui/Conditional';

type Props = {
  open: boolean;
  onClose: () => void;
};
const CreateForm = loadable(() => import('./CreateUser'), { fallback: <h3>Loading...</h3> });
const CreateCustomer = loadable(() => import('./CustomerUserForm'), { fallback: <h3>Loading...</h3> });

export default function Create({ onClose, open }: Props) {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  const handleChangeIsClient = () => setIsClient(!isClient);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { pb: 5, width: 600 } }}
      anchor="right"
      ModalProps={{
        keepMounted: false,
      }}
    >
      <Stack
        direction="column"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 2 }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{ p: 2 }}
        >
          <Typography variant="h4" gutterBottom>
            {t('managements.createUser')}
          </Typography>
          <FormControlLabel
            control={<Switch checked={isClient} onChange={handleChangeIsClient} />}
            label={t('managements.isClient')}
          />
        </Stack>
        <Conditional
          loadable={open && !isClient}
          initialComponent={null}
        >
          <Suspense fallback={<h3>Loading...</h3>}>
            <CreateForm
              onClose={onClose}
            />
          </Suspense>
        </Conditional>
        <Conditional
          loadable={open && isClient}
          initialComponent={null}
        >
          <Suspense fallback={<h3>Loading...</h3>}>
            <CreateCustomer
              userId=""
              onClose={onClose}
            />
          </Suspense>
        </Conditional>
      </Stack>
    </Drawer>
  );
}
