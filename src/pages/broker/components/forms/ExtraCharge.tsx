// Extra Charge
import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Container, DialogContent, Grid, Stack, DialogActions, Button, Alert,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { ControlledTextField, ControlledAutocomplete } from '@gsuite/shared/ui';
import { NotificationsContext } from '@gsuite/shared/contexts/NotificationsContext';

import { useWarehouses } from '../../services/warehouses';
import SubExtraCharge from './SubExtraCharge';
import TableExtraCharge from '../TableExtraCharge';
import { useAddExtraCharge } from '../../services/operation-detail';

type AutoComplete = {
  _id: string;
  name: string;
  distributionChannel: string;
  salesOffice: string;
};

export type Charge = {
  id?: number;
  sapid: string;
  qty: number;
  charge: string;
};

type Props = {
  id: string;
  onClose: () => void;
};

export default function ExtraCharge({ onClose, id }: Props) {
  const { data } = useWarehouses();
  const { t } = useTranslation();
  const [addExtraCharge] = useAddExtraCharge(id);
  const { setSnackBar } = useContext(NotificationsContext);
  const [chargeAdd, setChargesAdd] = useState<Charge[]>([]);

  const schema = yup.object().shape({
    warehouse: yup.object({}).required(t('broker.warehouseSchema')),
    reference: yup.string().required(t('broker.referencesSchema')),
    notes: yup.string().optional().min(3, t('broker.notesSchema')),
    invoiceDate: yup.date().required(t('broker.invoiceDateSchema')),
    charges: yup.array().required(t('broker.chargesSchema')),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm<FieldValues>({
    resolver: yupResolver(schema),
  });
  const getErrorCharges = () => {
    const { charges } = errors;
    return charges;
  };
  const onChangeCharges = (charges: FieldValues) => {
    const { charge, qty } = charges;
    setChargesAdd([{ ...charge, qty }, ...chargeAdd]);
    setValue('charges', [{ ...charge, qty }, ...chargeAdd]);
  };
  const handelSubmit = async (formValues: FieldValues) => {
    await addExtraCharge({
      variables: {
        id,
        extraCharge: {
          ...formValues,
        },
      },
      onError: () => {
        setSnackBar('error', t('broker.addExtraChargeError'));
      },
      onCompleted: () => {
        setSnackBar('success', t('broker.addExtraChargeSuccess'));
        onClose();
      },
    });
  };
  return (
    <Container>
      <form onSubmit={handleSubmit(handelSubmit)}>
        <DialogContent>
          <Grid
            container
            spacing={2}
            sx={{
              padding: 0,
              width: {
                lg: '800px',
                md: '600px',
              },
            }}
          >
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Stack spacing={2} sx={{ pt: 1 }}>
                <ControlledTextField
                  fieldName="reference"
                  errors={errors}
                  inputType="text"
                  label={t('broker.referencesLabel')}
                  register={register}
                  key="reference-field"
                />
              </Stack>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Stack spacing={2} sx={{ pt: 1 }}>
                <ControlledTextField
                  label={t('broker.invoiceDateLabel')}
                  register={register}
                  inputType="date"
                  errors={errors}
                  fieldName="invoiceDate"
                  key="invoiceDate-field"
                />
              </Stack>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Stack spacing={2} sx={{ pt: 1 }}>
                <ControlledAutocomplete
                  errors={errors}
                  name="warehouse"
                  label={t('broker.warehouseLabel')}
                  control={control}
                  options={data?.findAllWarehouses ?? []}
                  key="warehouse-autocomplete"
                  optionLabel={({ name }: AutoComplete) => name}
                  valueSerializer={({ name, distributionChannel, salesOffice }: AutoComplete) => ({
                    name,
                    distributionChannel,
                    salesOffice,
                  })}
                />
                <ControlledTextField
                  label={t('broker.notesLabel')}
                  register={register}
                  inputType="text"
                  errors={errors}
                  fieldName="notes"
                  key="notes-field"
                />
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
      </form>
      <SubExtraCharge handlerAddCharge={onChangeCharges} />
      {getErrorCharges() && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }} style={{ marginTop: 16 }}>
          <Alert severity="error" style={{ width: '100%' }}>
            {t('broker.messageAddExtraCharge')}
          </Alert>
        </Stack>
      )}
      <DialogActions>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Button sx={{ width: '200px' }} color="error" variant="contained" onClick={onClose}>
            {t('cancel')}
          </Button>
          <LoadingButton
            sx={{ width: '200px' }}
            variant="contained"
            type="submit"
            loading={false}
            onClick={handleSubmit(handelSubmit)}
          >
            {t('register')}
          </LoadingButton>
        </Stack>
      </DialogActions>
      {chargeAdd.length > 0 && (
        <TableExtraCharge
          charges={chargeAdd.map((eCharge, index) => ({ ...eCharge, id: index }))}
        />
      )}
    </Container>
  );
}
