// Pickup at the airport and delivery in Tijuana
import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DialogContent, DialogActions, Button, Stack, Grid, MenuItem, Container,
} from '@mui/material';
import { FieldValues, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@apollo/client';
import { LoadingButton } from '@mui/lab';

import {
  ControlledSelect, ControlledTextField, ControlledAutocomplete, Dropzone,
} from '@gsuite/shared/ui';
import { NotificationsContext } from '@gsuite/shared/contexts/NotificationsContext';
import { FileDropZone } from '@gsuite/typings/files';

import { REGISTER_RAET } from '../../services/raet';
import { DASHBOARD_DATA } from '../../services/operation-dashboard';
import { uploadFiles, createArrayFiles } from '../../services/uploadFiles';
import { useCompanies } from '../../services/companies';

const bulkOptions = ['Caja', 'Pallet'];

const airPorts = [
  'Imperial Beach airport-KNRS',
  'Aeropuerto Municipal Brown Field',
  'Aeropuerto Internacional de San Diego',
  'Aeropuerto Internacional de Los Ángeles',
  'Aeropuerto de Long Beach',
  'Aeropuerto Internacional de San Bernardino',
];

type Props = {
  handleClose: () => void;
  handleCreateOperation: () => void;
};

type AutoComplete = {
  _id: string;
  name: string;
  number: string;
};

export default function Raet({ handleClose, handleCreateOperation }: Props) {
  const { t } = useTranslation();
  const [packingListFiles, setPackingListFiles] = useState<FileDropZone[]>([]);
  const [additionalDocs, setAdditionalDocs] = useState<FileDropZone[]>([]);
  const { setSnackBar } = useContext(NotificationsContext);
  const [createOperation, { data, loading }] = useMutation(REGISTER_RAET);
  const { data: companiesData } = useCompanies();

  const schema = Yup.object({
    client: Yup.string().required(t('broker.clientSchema')),
    clientNumber: Yup.string().required('required'),
    airport: Yup.string().required(t('broker.airportSchema')),
    guideNumber: Yup.string().required(t('broker.guideNumberSchema')),
    date: Yup.string().required(t('broker.dateEstimatedSchema')),
    quantity: Yup.number().required(t('broker.quantityOperationSchema')).typeError('You must specify a number'),
    notes: Yup.string().nullable().optional(),
    bodyType: Yup.string().required(t('broker.packageTypeSchema')),
    reference: Yup.string().nullable().optional(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const submitHandler = async ({
    client,
    clientNumber,
    airport,
    guideNumber,
    date,
    quantity,
    notes,
    bodyType,
    reference,
  }: FieldValues) => {
    try {
      let packingListFilesArr = null;
      if (packingListFiles.length) {
        const files = await uploadFiles(packingListFiles);
        if (Array.isArray(files)) {
          packingListFilesArr = createArrayFiles(files);
        }
      } else {
        return setSnackBar('error', 'Packing list files are required');
      }

      let additionalDocsArr = null;
      if (additionalDocs.length) {
        const files = await uploadFiles(additionalDocs);
        if (Array.isArray(files)) {
          additionalDocsArr = createArrayFiles(files);
        }
      }

      await createOperation({
        variables: {
          client,
          clientNumber,
          airport,
          guideNumber,
          expectedArrivalDate: date,
          notificationDate: Date.now().toString(),
          quantity,
          ...(notes && { notes }),
          packageType: bodyType,
          ...(reference && { reference }),
          step: 0,
          history: {
            date: Date.now().toString(),
            packingListFiles: packingListFilesArr,
            step: 0,
            ...(additionalDocsArr && { additionalFiles: additionalDocsArr }),
          },
          entryType: 'land',
        },
        refetchQueries: [{ query: DASHBOARD_DATA }],
      });

      if (!data) {
        setSnackBar('error', 'Something went wrong');
      }
      setSnackBar('success', 'Operation created successfully');
      reset();
      handleCreateOperation();
      return handleClose();
    } catch (err) {
      const messageError = err as Error;
      return setSnackBar('error', messageError.message ?? 'Something went wrong');
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent
          sx={{
            width: 'auto',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <Grid
            container
            sx={{
              padding: 0,
              width: {
                lg: '800px',
                md: '600px',
              },
            }}
            spacing={2}
          >
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Stack spacing={2} sx={{ pt: 1 }}>
                <ControlledAutocomplete
                  errors={errors}
                  name="client"
                  label={`${t('broker.clientLabel')} *`}
                  control={control}
                  options={companiesData?.findCompanies ?? []}
                  key="clients-autocomplete"
                  optionLabel={({ name, number }: AutoComplete) => `${number} - ${name}`}
                  valueSerializer={({ name, number } : AutoComplete) => {
                    setValue('clientNumber', number);
                    return name;
                  }}
                />
                <ControlledSelect
                  label={`${t('broker.airportLabel')} *`}
                  control={control}
                  name="airport"
                  key="airport-select"
                  errors={errors}
                  defaultValue=""
                >
                  {airPorts.map((airport) => (
                    <MenuItem key={airport} value={airport}>
                      {airport}
                    </MenuItem>
                  ))}
                </ControlledSelect>
                <ControlledTextField
                  label={`${t('broker.guideNumberLabel')} *`}
                  register={register}
                  inputType="text"
                  errors={errors}
                  fieldName="guideNumber"
                  key="guideNumber-field"
                />
                <ControlledTextField
                  label={`${t('broker.dateEstimatedLabel')} *`}
                  register={register}
                  inputType="date"
                  errors={errors}
                  fieldName="date"
                  key="date-field"
                />
              </Stack>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Stack spacing={2} sx={{ pt: 1 }}>
                <ControlledSelect
                  label={`${t('broker.packageTypeLabel')} *`}
                  control={control}
                  name="bodyType"
                  key="bodyType-select"
                  errors={errors}
                  defaultValue=""
                >
                  {bulkOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </ControlledSelect>
                <ControlledTextField
                  label={`${t('broker.quantityLabel')} *`}
                  register={register}
                  inputType="number"
                  errors={errors}
                  fieldName="quantity"
                  key="quantity-field"
                  registerOptions={{ valueAsNumber: true }}
                />
                <ControlledTextField
                  label={t('broker.notesLabel')}
                  register={register}
                  inputType="text"
                  errors={errors}
                  fieldName="notes"
                  key="notes-field"
                />
                <ControlledTextField
                  label={t('broker.referencesLabel')}
                  register={register}
                  inputType="text"
                  errors={errors}
                  fieldName="reference"
                  key="reference-field"
                />
              </Stack>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Dropzone
                label={`${t('broker.packingListFiles')} *`}
                files={packingListFiles}
                filesSetter={setPackingListFiles}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Dropzone label={t('broker.additionalFiles')} files={additionalDocs} filesSetter={setAdditionalDocs} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('cancel')}</Button>
          <LoadingButton variant="contained" type="submit" loading={loading}>
            {t('register')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Container>
  );
}
