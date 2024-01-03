// Border crossing USA - MX
import { useState, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DialogContent, DialogActions, Button, Stack, Grid, Container, Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FieldValues, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CachedIcon from '@mui/icons-material/Cached';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { LoadingButton } from '@mui/lab';

import { FileDropZone } from '@gsuite/typings/files';
import { ControlledTextField, Dropzone } from '@gsuite/shared/ui';
import { NotificationsContext } from '@gsuite/shared/contexts/NotificationsContext';

import { useAddHistory, useSkipTransport, useUpdateHistory } from '../../services/operation-detail';
import { uploadFiles, createArrayFiles } from '../../services/uploadFiles';
import { useTrafficNumberValidation } from '../../services/verifyTrafficNumber';
import { useStepInfo } from '../../services/stepInfo';
import { difference } from '../../helper';

type Props = {
  submitFrom: () => void;
  onClose: () => void;
  operationId: string;
  isEdit: boolean;
  isOnlyView?: boolean;
};

interface CfUsaMxStep extends Record<string, unknown> {
  economicNumber: string;
  trafficNumber: string;
  vehicleType: string;
  driver: string;
  notes: string;
}

export default function USAMXCrossover({
  submitFrom, onClose, operationId, isEdit, isOnlyView = true,
}: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { setSnackBar } = useContext(NotificationsContext);
  const [addHistory, { loading }] = useAddHistory(operationId);
  const [updateHistory] = useUpdateHistory(operationId);
  const [getStepInfo] = useStepInfo();
  const [oldValue, setOldValue] = useState<CfUsaMxStep>();
  const {
    debouncedValidation, isValid, hasError, data, loading: trafficNumberLoading,
  } = useTrafficNumberValidation();
  const [skipTransport, { loading: loadingSkipTransport }] = useSkipTransport(operationId);
  const [additionalDocs, setAdditionalDocs] = useState<FileDropZone[]>([]);

  const schema = Yup.object({
    economicNumber: Yup.string().typeError(t<string>('broker.economicNumberSchema')).required(t<string>('broker.economicNumberSchema')),
    trafficNumber: Yup.string().typeError(t<string>('broker.trafficNumberSchema')).required(t<string>('broker.trafficNumberSchema')),
    vehicleType: Yup.string().typeError(t<string>('broker.vehicleTypeSchema')).required(t<string>('broker.vehicleTypeSchema')),
    driver: Yup.string().typeError(t<string>('broker.driverSchema')).required(t<string>('broker.driverSchema')),
    notes: Yup.string().nullable().optional(),
  });

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    setValue('economicNumber', data?.trafficNumber?.economicNumber ?? null);
    setValue('vehicleType', data?.trafficNumber?.vehicleType ?? null);
    setValue('driver', data?.trafficNumber?.driver ?? null);
  }, [data?.trafficNumber, setValue]);

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
    const getStepData = async () => {
      const { data: stepInfo } = await getStepInfo({
        variables: {
          id: operationId,
          step: 6,
        },
      });

      reset({
        ...stepInfo?.getStepInfo,
      });

      setOldValue({
        ...stepInfo?.getStepInfo,
      } as CfUsaMxStep);
    };
    if (isEdit) {
      getStepData();
    }
  }, [getStepInfo, isEdit, operationId, reset]);

  const submitHandler = async ({
    trafficNumber, economicNumber, driver, vehicleType, notes,
  }: FieldValues) => {
    if (hasError || !isValid) {
      return;
    }

    let additionalFiles = null;
    if (additionalDocs.length) {
      const files = await uploadFiles(additionalDocs);
      if (Array.isArray(files)) {
        additionalFiles = createArrayFiles(files);
      }
    }

    const stepData = {
      id: operationId,
      trafficNumber: String(trafficNumber).trim(),
      economicNumber,
      driver,
      vehicleType,
      notes,
      additionalFiles,
      step: 6,
    };

    if (isEdit) {
      const newValue = {
        trafficNumber,
        economicNumber,
        driver,
        vehicleType,
        notes,
      };

      const changes = difference<CfUsaMxStep>(
        oldValue ?? {} as CfUsaMxStep,
        newValue,
      );
      await updateHistory({
        variables: {
          ...stepData,
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
          setSnackBar('success', t<string>('broker.updateStepSuccess'));
        },
      });
      submitFrom();
      return;
    }

    await addHistory({
      variables: stepData,
      onError: (error) => {
        if (error?.graphQLErrors[0]?.extensions['key']) {
          setSnackBar('error', t(`broker.${error.graphQLErrors[0].extensions['key']}`));
        } else {
          setSnackBar('error', t('broker.borderCrossingError'));
        }
      },
      onCompleted: () => {
        setSnackBar('success', t('broker.borderCrossingSuccess'));
        submitFrom();
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
        additionalFiles,
        step: 6,
        isEdit,
      },
      onError: (error) => {
        if (error?.graphQLErrors[0]?.extensions['key']) {
          setSnackBar('error', t(`broker.${error.graphQLErrors[0].extensions['key']}`));
        } else {
          setSnackBar('error', error.message);
        }
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
                  label={`${t<string>('broker.trafficNumberLabel')} *`}
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
                  label={t<string>('broker.notesLabel')}
                  register={register}
                  inputType="text"
                  errors={errors}
                  fieldName="notes"
                  key="notes-field"
                  disabled={isOnlyView}
                />
                <ControlledTextField
                  label={t<string>('broker.economicNumber')}
                  register={register}
                  inputType="text"
                  disabled
                  errors={errors}
                  fieldName="economicNumber"
                  key="economicNumber-field"
                />
                <ControlledTextField
                  label={t<string>('broker.vehicleType')}
                  register={register}
                  inputType="text"
                  disabled
                  errors={errors}
                  fieldName="vehicleType"
                  key="vehicleType-field"
                />
                <ControlledTextField
                  label={t<string>('broker.driver')}
                  register={register}
                  inputType="text"
                  disabled
                  errors={errors}
                  fieldName="driver"
                  key="driver-field"
                />
              </Stack>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Dropzone label={t<string>('broker.additionalFiles')} files={additionalDocs} filesSetter={setAdditionalDocs} disabled={isOnlyView} />
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
            <LoadingButton
              variant="outlined"
              loading={loadingSkipTransport}
              color="secondary"
              onClick={handleSkipTransport}
              disabled={isOnlyView}
            >
              {t<string>('broker.skipTransport')}
            </LoadingButton>
            <Stack
              direction="row"
              spacing={2}
            >
              <Button onClick={onClose}>{t<string>('cancel')}</Button>
              <LoadingButton variant="contained" type="submit" loading={loading} disabled={isOnlyView}>
                {isEdit ? t<string>('update') : t<string>('register')}
              </LoadingButton>
            </Stack>
          </Stack>
        </DialogActions>
      </form>
    </Container>
  );
}
