// Collection in Puerto Long Beach and delivery in Tijuana
import { useState, useContext } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  DialogContent, DialogActions, Button, Stack, Grid, MenuItem, Container,
} from '@mui/material';
import { useMutation } from '@apollo/client';
import { LoadingButton } from '@mui/lab';

import { FileDropZone } from '@gsuite/typings/files';
import {
  ControlledTextField,
  ControlledSelect,
  Dropzone,
  ControlledAutocomplete,
} from '@gsuite/shared/ui';
import { NotificationsContext } from '@gsuite/shared/contexts/NotificationsContext';

import { uploadFiles, createArrayFiles } from '../../services/uploadFiles';
import { REGISTER_RPLBET } from '../../services/rplbet';
import { useCompanies } from '../../services/companies';
import { DASHBOARD_DATA } from '../../services/operation-dashboard';

const bulkOptions = ['Caja', 'Pallet'];
const sizeContainer = ['450005 - 20', '450004 - 40'];

type Props = {
  handleClose: () => void;
  handleCreateOperation: () => void;
};
type AutoComplete = {
  _id: string;
  name: string;
  number: string;
};

export default function Rplbet({ handleClose, handleCreateOperation }: Props) {
  const { t } = useTranslation();
  const [packingListFiles, setPackingListFiles] = useState<FileDropZone[]>([]);
  const [additionalDocs, setAdditionalDocs] = useState<FileDropZone[]>([]);
  const { setSnackBar } = useContext(NotificationsContext);
  const [createOperation, { data, loading }] = useMutation(REGISTER_RPLBET);
  const { data: companiesData } = useCompanies();

  const schema = Yup.object({
    client: Yup.string().required(t<string>('broker.clientSchema')),
    clientNumber: Yup.string().required('required'),
    container: Yup.string().required(t<string>('broker.containerSchema')),
    expectedArrivalDate: Yup.string().required(t<string>('broker.expectedArrivalDateSchema')),
    packageType: Yup.string().required(t<string>('broker.packageTypeSchema')),
    quantity: Yup.number().required(t<string>('broker.quantityOperationSchema')).typeError('You must specify a number'),
    reference: Yup.string().nullable().optional(),
    notes: Yup.string().nullable().optional(),
    containerSize: Yup.string().required(t<string>('broker.containerSizeSchema')),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    reset,
  } = useForm<FieldValues>({
    resolver: yupResolver(schema),
  });

  const submitHandler = async ({
    client,
    clientNumber,
    container,
    expectedArrivalDate,
    packageType,
    quantity,
    reference,
    notes,
    containerSize,
  }: FieldValues) => {
    try {
      let packingListFilesArr = null;
      if (packingListFiles.length) {
        const files = await uploadFiles(packingListFiles);
        if (Array.isArray(files)) {
          packingListFilesArr = createArrayFiles(files);
        }
      } else {
        return setSnackBar('error', t('broker.packingListFilesSchema'));
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
          container,
          expectedArrivalDate,
          packageType,
          quantity,
          containerSize,
          ...(reference && { reference }),
          ...(notes && { notes }),
          step: 0,
          history: {
            date: Date.now().toString(),
            packingListFiles: packingListFilesArr,
            step: 0,
            ...(additionalDocsArr && { additionalFiles: additionalDocsArr }),
          },
          entryType: 'sea',
        },
        refetchQueries: [{ query: DASHBOARD_DATA }],
      });

      if (!data) {
        setSnackBar('error', t('unexpectedError'));
      }
      setSnackBar('success', t('broker.operationCreated'));
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
                  label={`${t<string>('broker.clientLabel')} *`}
                  control={control}
                  options={companiesData?.findCompanies ?? []}
                  key="clients-autocomplete"
                  optionLabel={({ name, number }: AutoComplete) => `${number} - ${name}`}
                  valueSerializer={({ name, number } : AutoComplete) => {
                    setValue('clientNumber', number);
                    return name;
                  }}
                />
                <ControlledTextField
                  fieldName="container"
                  errors={errors}
                  inputType="text"
                  label={`${t<string>('broker.containerLabel')} *`}
                  register={register}
                  key="container-field"
                />
                <ControlledTextField
                  fieldName="expectedArrivalDate"
                  errors={errors}
                  inputType="date"
                  label={`${t<string>('broker.dateEstimatedLabel')} *`}
                  register={register}
                  key="expectedArrivalDate-field"
                />
                <ControlledSelect
                  label={`${t<string>('broker.packageTypeLabel')} *`}
                  name="packageType"
                  key="packageType-select"
                  errors={errors}
                  defaultValue=""
                  control={control}
                >
                  {bulkOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </ControlledSelect>
              </Stack>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Stack spacing={2} sx={{ pt: 1 }}>
                <ControlledTextField
                  label={`${t<string>('broker.quantityLabel')} *`}
                  register={register}
                  inputType="number"
                  errors={errors}
                  fieldName="quantity"
                  key="quantity-field"
                  registerOptions={{ valueAsNumber: true }}
                />
                <ControlledTextField
                  label={t<string>('broker.notesLabel')}
                  register={register}
                  inputType="text"
                  errors={errors}
                  fieldName="notes"
                  key="notes-field"
                />
                <ControlledTextField
                  label={t<string>('broker.referencesLabel')}
                  register={register}
                  inputType="text"
                  errors={errors}
                  fieldName="reference"
                  key="reference-field"
                />
                <ControlledSelect
                  label={`${t<string>('broker.containerSizeLabel')} *`}
                  name="containerSize"
                  key="containerSize-select"
                  errors={errors}
                  defaultValue=""
                  control={control}
                >
                  {sizeContainer.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </ControlledSelect>
              </Stack>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Dropzone
                label={`${t<string>('broker.packingListFiles')} *`}
                files={packingListFiles}
                filesSetter={setPackingListFiles}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Dropzone label={t<string>('broker.additionalFiles')} files={additionalDocs} filesSetter={setAdditionalDocs} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t<string>('cancel')}</Button>
          <LoadingButton variant="contained" type="submit" loading={loading}>
            {t<string>('register')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Container>
  );
}
