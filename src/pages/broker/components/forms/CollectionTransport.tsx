// Transport Collection
import {
  useState, useContext, useEffect, useMemo,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  DialogContent, DialogActions, Button, Stack, Grid, Container, Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CachedIcon from '@mui/icons-material/Cached';
import ErrorIcon from '@mui/icons-material/Error';

import { FieldValues, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { FileDropZone } from '@gsuite/typings/files';
import {
  ControlledTextField,
  Dropzone,
  ControlledAutocomplete,
} from '@gsuite/shared/ui';
import { NotificationsContext } from '@gsuite/shared/contexts/NotificationsContext';

import { useTrafficNumberValidation } from '../../services/verifyTrafficNumber';
import { uploadFiles, createArrayFiles } from '../../services/uploadFiles';
import { useAddHistory, useSkipTransport, useUpdateHistory } from '../../services/operation-detail';
import { useCompanies } from '../../services/companies';
import { useStepInfo } from '../../services/stepInfo';
import { difference } from '../../helper';

type Props = {
  submitFrom?: () => void;
  onClose: () => void;
  isCreateOperation?: boolean;
  operationId?: string;
  handleCreateOperation: () => void;
  isEdit?: boolean;
  isOnlyView?: boolean;
};

type AutoComplete = {
  _id: string;
  name: string;
  number: string;
};

interface RetpStep extends Record<string, any> {
  economicNumber?: string;
  trafficNumber?: string;
  vehicleType?: string;
  driver?: string;
  notes?: string;
  client?: string;
  clientNumber?: string;
}

export default function CollectionTransport({
  submitFrom = () => null,
  onClose,
  operationId = '',
  isCreateOperation = false,
  handleCreateOperation,
  isEdit = false,
  isOnlyView = false,
}: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [getStepInfo] = useStepInfo();
  const {
    debouncedValidation, isValid, hasError, data, loading: trafficNumberLoading,
  } = useTrafficNumberValidation();
  const { setSnackBar } = useContext(NotificationsContext);
  const [addHistory, { loading }] = useAddHistory(operationId);
  const [updateHistory] = useUpdateHistory(operationId);
  const [skipTransport, { loading: loadingSkipTransport }] = useSkipTransport(operationId);
  const [additionalDocs, setAdditionalDocs] = useState<FileDropZone[]>([]);
  const [oldValue, setOldValue] = useState<RetpStep>();

  const schema = Yup.object({
    economicNumber: Yup.string().typeError(t('broker.economicNumberSchema')).required(t('broker.economicNumberSchema')),
    trafficNumber: Yup.string().typeError(t('broker.trafficNumberSchema')).required(t('broker.trafficNumberSchema')),
    vehicleType: Yup.string().typeError(t('broker.vehicleTypeSchema')).required(t('broker.vehicleTypeSchema')),
    driver: Yup.string().typeError(t('broker.driverSchema')).required(t('broker.driverSchema')),
    notes: Yup.string().nullable().optional(),
    client: Yup.string().optional(),
    clientNumber: Yup.string().optional(),
  });

  const { data: companiesData } = useCompanies();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    setError,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: yupResolver(schema),
  });
  let inputAddornment = null;
  if (trafficNumberLoading) {
    inputAddornment = (
      <CachedIcon
        sx={{
          animation: 'spin 2s linear infinite',
          '@keyframes spin': {
            '0%': {
              transform: 'rotate(360deg)',
            },
            '100%': {
              transform: 'rotate(0deg)',
            },
          },
        }}
      />
    );
  }

  if (!trafficNumberLoading && getValues('trafficNumber') !== '' && hasError) {
    inputAddornment = (
      <Tooltip title="Please, enter a valid traffic number" placement="right">
        <ErrorIcon sx={{ color: theme.palette.error.main }} />
      </Tooltip>
    );
  }

  if (!trafficNumberLoading && !hasError && data?.trafficNumber?.economicNumber) {
    inputAddornment = <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
  }

  useEffect(() => {
    setValue('economicNumber', data?.trafficNumber?.economicNumber ?? null);
    setValue('vehicleType', data?.trafficNumber?.vehicleType ?? null);
    setValue('driver', data?.trafficNumber?.driver ?? null);
  }, [data?.trafficNumber, setValue]);

  useMemo(() => {
    const getInfoEdit = async () => {
      try {
        const { data: stepInfo } = await getStepInfo({
          variables: {
            id: operationId,
            step: 3,
          },
        });

        return stepInfo?.getStepInfo;
      } catch (error) {
        return null;
      }
    };
    if (isEdit) {
      getInfoEdit().then((info) => {
        const trafficNumber = info?.trafficNumber ?? null;
        const economicNumber = info?.economicNumber ?? null;
        const vehicleType = info?.vehicleType ?? null;
        const driver = info?.driver ?? null;
        const notes = info?.notes ?? null;
        const additionalFiles = info?.additionalFiles ?? null;
        const stepThreeInfo = {
          notes,
          trafficNumber,
          economicNumber,
          driver,
          vehicleType,
          additionalFiles,
        };

        reset(stepThreeInfo);

        setOldValue({
          notes,
          trafficNumber,
          economicNumber,
          driver,
          vehicleType,
          additionalFiles,
        } as RetpStep);
      });
    }
  }, [getStepInfo, isEdit, operationId, reset]);

  const submitHandler = async ({
    trafficNumber, economicNumber, vehicleType, driver, notes, client, clientNumber,
  }: FieldValues) => {
    if (hasError || !isValid) {
      return;
    }
    if (isCreateOperation && (!client || !clientNumber)) {
      setError('client', {
        type: 'manual',
        message: t('broker.clientSchema'),
      });
      return;
    }

    let additionalFiles = null;
    if (additionalDocs.length) {
      const files = await uploadFiles(additionalDocs);
      if (Array.isArray(files)) {
        additionalFiles = createArrayFiles(files);
      }
    }

    if (isEdit) {
      const newValue = {
        trafficNumber, economicNumber, vehicleType, driver, notes, client, clientNumber,
      };

      const changes = difference<RetpStep>(oldValue!, { ...newValue });

      await updateHistory({
        variables: {
          id: operationId,
          notes,
          trafficNumber,
          economicNumber,
          additionalFiles,
          driver,
          vehicleType,
          step: 3,
          logInput: {
            system: 'operations',
            user: '',
            action: 'update',
            newValue: JSON.stringify(changes),
            date: new Date(),
          },
        },
        onError: (e) => {
          setSnackBar('error', e.message);
        },
        onCompleted: () => {
          setSnackBar('success', t('broker.updateStepSuccess'));
          submitFrom();
        },
      });
      onClose();
      return;
    }

    await addHistory({
      variables: {
        id: operationId,
        trafficNumber: String(trafficNumber).trim(),
        economicNumber,
        driver,
        vehicleType,
        notes,
        additionalFiles,
        step: 3,
        client,
        clientNumber,
        isCreateOperation,
      },
      onError: (error) => {
        if (error?.graphQLErrors[0]?.extensions['key']) {
          setSnackBar('error', t(`broker.${error.graphQLErrors[0].extensions['key']}`));
        } else {
          setSnackBar('error', t('broker.transportCollectionError'));
        }
      },
      onCompleted: () => {
        setSnackBar('success', t('broker.transportCollectionSuccess'));
        submitFrom();
        handleCreateOperation();
        onClose();
      },
    });
  };

  const handleSkipTransport = async () => {
    const { notes } = getValues();

    let additionalFiles = null;
    if (additionalDocs.length) {
      const files = await uploadFiles(additionalDocs);
      if (Array.isArray(files)) {
        additionalFiles = createArrayFiles(files);
      }
    }

    await skipTransport({
      variables: {
        id: operationId,
        notes,
        step: 3,
        additionalFiles,
        isEdit,
      },
      onError: () => {
        setSnackBar('error', t('broker.transportCollectionError'));
      },
      onCompleted: () => {
        setSnackBar('success', t('broker.transportCollectionSuccess'));
        submitFrom();
        onClose();
      },
    });
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(submitHandler)} autoComplete="off">
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
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Stack spacing={2} sx={{ pt: 1 }}>
                <ControlledTextField
                  label={`${t('broker.trafficNumberLabel')} *`}
                  register={register}
                  inputType="text"
                  errors={errors}
                  fieldName="trafficNumber"
                  key="trafficNumber-field"
                  customOnChange={debouncedValidation}
                  endAdornment={inputAddornment}
                  disabled={isOnlyView}
                />
                <ControlledTextField
                  label={t('broker.notesLabel')}
                  register={register}
                  inputType="text"
                  errors={errors}
                  fieldName="notes"
                  key="notes-field"
                  disabled={isOnlyView}
                />
                <ControlledTextField
                  label={t('broker.economicNumber')}
                  register={register}
                  inputType="text"
                  disabled
                  errors={errors}
                  fieldName="economicNumber"
                  key="economicNumber-field"
                />
                <ControlledTextField
                  label={t('broker.vehicleType')}
                  register={register}
                  inputType="text"
                  disabled
                  errors={errors}
                  fieldName="vehicleType"
                  key="vehicleType-field"
                />
                <ControlledTextField
                  label={t('broker.driver')}
                  register={register}
                  inputType="text"
                  disabled
                  errors={errors}
                  fieldName="driver"
                  key="driver-field"
                />
                {isCreateOperation && (
                  <ControlledAutocomplete
                    errors={errors}
                    name="client"
                    label={`${t('broker.clientLabel')} *`}
                    control={control}
                    options={companiesData?.findCompanies ?? []}
                    key="clients-autocomplete"
                    optionLabel={({ name, number }: AutoComplete) => `${number} - ${name}`}
                    valueSerializer={({ name, number }: AutoComplete) => {
                      setValue('clientNumber', number);
                      return name;
                    }}
                  />
                )}
              </Stack>
            </Grid>
          </Grid>
          {/* Dropzone fields */}
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Dropzone label={t('broker.additionalFiles')} files={additionalDocs} filesSetter={setAdditionalDocs} disabled={isOnlyView} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              minWidth: '100%',
            }}

          >
            {!isCreateOperation && (
              <LoadingButton
                variant="outlined"
                loading={loadingSkipTransport}
                color="secondary"
                onClick={handleSkipTransport}
                disabled={isOnlyView}
              >
                {t('broker.skipTransport')}
              </LoadingButton>
            )}
            <Stack
              direction="row"
              spacing={2}
            >
              <Button onClick={onClose}>{t('cancel')}</Button>
              <LoadingButton variant="contained" type="submit" loading={loading} disabled={isOnlyView}>
                {isEdit ? t('update') : t('register')}
              </LoadingButton>
            </Stack>
          </Stack>
        </DialogActions>
      </form>
    </Container>
  );
}
