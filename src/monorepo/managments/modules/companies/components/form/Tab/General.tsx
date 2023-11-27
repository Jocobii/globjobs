import { useContext } from 'react';
import { MenuItem, Stack, Grid } from '@mui/material';
import { ControlledTextField, ControlledSelect } from '@gsuite/shared/ui';
import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { TYPE_OPTIONS, PAYMENT_METHODS } from '../../../utils/constants';
import { FormContext } from '../../../context/FormContext';
import { Companies } from '../../../types';

type Props = {
  register: UseFormRegister<Companies>;
  control: Control<Companies>;
  errors: FieldErrors<Companies>;
  paymentDefault: string;
};

export default function General({
  register,
  control,
  errors,
  paymentDefault,
}: Readonly<Props>) {
  const { typeSelect } = useContext(FormContext);

  return (
    <div style={{ margin: 20 }}>
      <Grid container xs={12} direction="column" spacing={2}>
        <Grid item xs={4} spacing={2}>
          <Stack direction="row" spacing={2}>
            <ControlledTextField
              errors={errors}
              fieldName="number"
              inputType="text"
              label="Clave de Identificación SAP"
              register={register}
              key="name-field"
              disabled
            />
            <ControlledTextField
              errors={errors}
              fieldName="name"
              inputType="text"
              label="Razón Social"
              register={register}
              key="name-field"
              disabled
            />
            <ControlledTextField
              errors={errors}
              fieldName="rfc"
              inputType="text"
              label="RFC"
              register={register}
              key="name-field"
              disabled
            />
          </Stack>
        </Grid>
      </Grid>
      <Grid container xs={12} sx={{ mt: 2 }} direction="row" spacing={2}>
        <Grid item xs={8} spacing={2}>
          <Stack direction="row" spacing={2}>
            <ControlledTextField
              errors={errors}
              fieldName="address.address1"
              inputType="text"
              label="Calle y Número"
              register={register}
              key="name-field"
              disabled
            />
            <ControlledTextField
              errors={errors}
              fieldName="address.address2"
              inputType="text"
              label="Colonia"
              register={register}
              key="name-field"
              disabled
            />
          </Stack>
        </Grid>
        <Grid item xs={4} spacing={2}>
          <Stack direction="row" spacing={2}>
            <ControlledTextField
              errors={errors}
              fieldName="address.postalCode"
              inputType="text"
              label="Código Postal"
              register={register}
              key="name-field"
              disabled
            />
            <ControlledTextField
              errors={errors}
              fieldName="address.city"
              inputType="text"
              label="Ciudad"
              register={register}
              key="name-field"
              disabled
            />
            <ControlledTextField
              errors={errors}
              fieldName="address.state"
              inputType="text"
              label="Estado"
              register={register}
              key="name-field"
              disabled
            />
          </Stack>
        </Grid>
      </Grid>
      <Grid container xs={12} sx={{ mt: 2 }} direction="row" spacing={2}>
        <Grid item xs={4} spacing={2}>
          <Stack direction="row" spacing={2}>
            <ControlledSelect
              label="Tipo"
              control={control}
              name="type"
              key="type-select"
              errors={errors}
              defaultValue={typeSelect}
            >
              {TYPE_OPTIONS.map(({ label, key }) => (
                <MenuItem key={key} value={key}>
                  {label}
                </MenuItem>
              ))}
            </ControlledSelect>
          </Stack>
        </Grid>
        <Grid item xs={4} spacing={2}>
          <Stack direction="row" spacing={2}>
            <ControlledSelect
              label="Metodo de pago predeterminado"
              control={control}
              name="defaultPaymentMethod"
              key="type-select-default-payment"
              errors={errors}
              defaultValue={paymentDefault}
            >
              {PAYMENT_METHODS.map((label) => (
                <MenuItem key={label} value={label}>
                  {label}
                </MenuItem>
              ))}
            </ControlledSelect>
          </Stack>
        </Grid>
      </Grid>
    </div>
  );
}
