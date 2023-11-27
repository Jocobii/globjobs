import { useContext } from 'react';
import type { Control, FieldValues } from 'react-hook-form';
import { Grid, Stack, Typography } from '@mui/material';
import { ControlledSwitch } from '@gsuite/shared/ui';
import { FormContext } from '../../../../context/FormContext';

type Props = {
  control: Control<FieldValues>;
};

export default function Aaus({
  control,
}: Readonly<Props>) {
  const {
    disableEntryInvoice,
    disableEntrySupplier,
    disableShippingInvoice,
    disableShippingSupplier,
  } = useContext(FormContext);

  return (
    <Grid
      direction="column"
      container
      spacing={4}
      sx={{ p: 5 }}
    >
      <Stack spacing={2} direction="row" sx={{ p: 1 }}>
        <ControlledSwitch
          name="uens.aaus.import"
          title="Importación"
          color="primary"
          control={control}
          disabled={false}
        />
        <ControlledSwitch
          name="uens.aaus.export"
          title="Exportacion"
          color="primary"
          control={control}
          disabled={false}
        />
      </Stack>
      <Stack spacing={2} direction="row" sx={{ p: 1 }}>
        <Stack spacing={2} direction="column" sx={{ p: 1 }}>
          <Typography variant="h6">Shipper</Typography>
          <ControlledSwitch
            name="uens.aaus.shipperInvoice"
            title="Shipper por factura"
            color="primary"
            control={control}
            disabled={disableShippingInvoice}
          />
          <ControlledSwitch
            name="uens.aaus.shipperSupplier"
            title="Shipper por proveedor"
            color="primary"
            control={control}
            disabled={disableShippingSupplier}
          />
        </Stack>
        <Stack spacing={2} direction="column" sx={{ p: 1 }}>
          <Typography variant="h6">Entry</Typography>
          <ControlledSwitch
            name="uens.aaus.entryInvoice"
            title="Entry por factura"
            color="primary"
            control={control}
            disabled={disableEntryInvoice}
          />
          <ControlledSwitch
            name="uens.aaus.entrySupplier"
            title="Entry por proveedor"
            color="primary"
            control={control}
            disabled={disableEntrySupplier}
          />
        </Stack>
      </Stack>
    </Grid>
  );
}
