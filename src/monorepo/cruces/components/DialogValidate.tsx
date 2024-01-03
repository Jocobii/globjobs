import { DialogComponent, ControlledAutocomplete } from '@gsuite/shared/ui';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Stack, Grid, Button } from '@mui/material';
import { useEffect } from 'react';

export type NewData = {
  plates: string;
  economic: string;
  country: string;
};

type Props = {
  open: boolean;
  handleConfirm: (newData: NewData) => void;
  handleCloseDialog?: () => void;
  closeView?: boolean;
  plates: string[];
  economics: string[];
  countrys: string[];
};

const REQUIRED_MESSAGE = 'Campo requerido';
export default function DialogValidate({
  open,
  handleConfirm,
  plates,
  economics,
  countrys,
  handleCloseDialog = () => {},
  closeView = true,
}: Props) {
  const { t } = useTranslation();
  const schema = yup.object().shape({
    plate: yup.string().required(REQUIRED_MESSAGE),
    economic: yup.string().required(REQUIRED_MESSAGE),
    country: yup.string().required(REQUIRED_MESSAGE),
  });

  const {
    getValues,
    formState: { errors },
    setValue,
    control,
  } = useForm<FieldValues>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue('plate', plates[0]);
    setValue('economic', economics[0]);
    setValue('country', countrys[0]);
  }, [setValue, plates, economics, countrys]);

  return (
    <DialogComponent
      open={open}
      title={t('managements.title_update_txt_file')}
      okButtonVisibility={false}
      cancelButtonVisibility={false}
    >
      <form autoComplete="off">
        <Grid
          container
          sx={{
            padding: 0,
            width: {
              lg: '400px',
              md: '300px',
            },
          }}
        >
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Stack spacing={2} sx={{ p: 1 }}>
              <ControlledAutocomplete
                errors={errors}
                name="plate"
                label={t('managements.plates')}
                control={control}
                defaultValue={plates[0]}
                multiple={false}
                options={plates}
                key="plate-autocomplete"
                optionLabel={(option: string) => option}
                valueSerializer={(option: string) => option}
                disabled={plates.length === 1}
              />
              <ControlledAutocomplete
                errors={errors}
                name="economic"
                label={t('managements.economic')}
                control={control}
                defaultValue={economics[0]}
                multiple={false}
                options={economics}
                key="economic-autocomplete"
                optionLabel={(option: string) => option}
                valueSerializer={(option: string) => option}
                disabled={economics.length === 1}
              />
              <ControlledAutocomplete
                errors={errors}
                name="country"
                label={t('managements.country')}
                control={control}
                defaultValue={countrys[0]}
                multiple={false}
                options={countrys}
                key="country-autocomplete"
                optionLabel={(option: string) => option}
                valueSerializer={(option: string) => option}
                disabled={countrys.length === 1}
              />
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                {closeView && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCloseDialog}
                  >
                    {t('cancel')}
                  </Button>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleConfirm(getValues() as NewData)}
                >
                  {t('managements.update_txt_file')}
                </Button>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </DialogComponent>
  );
}
