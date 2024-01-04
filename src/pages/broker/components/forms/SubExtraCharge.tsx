import * as yup from 'yup';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import {
  Grid, Stack, Button, Container,
} from '@mui/material';

import { ControlledTextField, ControlledAutocomplete } from '@gsuite/shared/ui';

import { useMaterial, Material } from '../../services/materials';

type Props = {
  handlerAddCharge: (formValues: FieldValues) => void;
};

export default function SubExtraCharge({ handlerAddCharge }: Props) {
  const { data } = useMaterial();
  const { t } = useTranslation();
  const schemaExtra = yup.object().shape({
    charge: yup
      .object()
      .shape({
        sapid: yup.string().required('SAP ID is required'),
        charge: yup.string().required('Charge is required'),
      })
      .required(t('broker.chargesSchema')),
    qty: yup.number().required(t('broker.quantitySchema')).typeError(t('broker.quantitySchema')),
  });

  const {
    register,
    handleSubmit: handleSubmitExtra,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schemaExtra),
  });
  const onSubmitExtra = (formValues: FieldValues) => {
    handlerAddCharge(formValues);
    reset();
  };
  return (
    <Container>
      <form id="sub-extra-charge" onSubmit={handleSubmitExtra(onSubmitExtra)}>
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
              <ControlledAutocomplete
                errors={errors}
                name="charge"
                label={t('broker.materialLabel')}
                control={control}
                options={data?.getMaterial ?? []}
                key="charge-autocomplete"
                optionLabel={({ textomaterial }: Material) => textomaterial}
                valueSerializer={({ material, textomaterial }: Material) => ({
                  sapid: material,
                  charge: textomaterial,
                })}
              />
            </Stack>
          </Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <ControlledTextField
                label={t('broker.quantityLabel')}
                register={register}
                inputType="number"
                errors={errors}
                fieldName="qty"
                key="qty-field"
              />
              <Button type="submit" variant="contained">
                {t('add')}
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
