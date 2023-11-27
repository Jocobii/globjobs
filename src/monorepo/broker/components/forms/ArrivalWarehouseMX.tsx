// Arrival Warehouse MX
import {
  useState, useContext, useEffect,
} from 'react';
import * as yup from 'yup';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { LoadingButton } from '@mui/lab';
import {
  Container, DialogContent, Stack, Grid, DialogActions, Button,
} from '@mui/material';

import { ControlledTextField, ControlledAutocomplete, Dropzone } from '@gsuite/shared/ui';
import { NotificationsContext } from '@gsuite/shared/contexts/NotificationsContext';

import { FileDropZone } from '@gsuite/typings/files';

import {
  useAddHistory, useSkipTransport, useUpdateHistory, useBorderInfo,
} from '../../services/operation-detail';
import { useWarehouses } from '../../services/warehouses';
import { uploadFiles, createArrayFiles } from '../../services/uploadFiles';
import { useStepInfo } from '../../services/stepInfo';
import { difference } from '../../helper';

type Props = {
  submitFrom: () => void;
  onClose: () => void;
  operationId: string;
  isEdit?: boolean;
  isOnlyView?: boolean;
};

type AutoComplete = {
  _id: string;
  name: string;
  distributionChannel: string;
  salesOffice: string;
};

type WarehouseInput = {
  name: string;
  distributionChannel: string;
  salesOffice: string;
};

interface ArrivalWarehouseMx extends Record<string, any> {
  trafficNumber: string;
  economicNumber: string;
  driver: string;
  vehicleType: string;
  warehouse: WarehouseInput;
  notes: string;
}

export default function ArrivalWarehouseMX({
  submitFrom, onClose, operationId, isEdit = false,
  isOnlyView = true,
}: Props) {
  const { t } = useTranslation();
  const { setSnackBar } = useContext(NotificationsContext);
  const [addHistory, { loading }] = useAddHistory(operationId);
  const [oldValue, setOldValue] = useState<ArrivalWarehouseMx>();
  const [updateHistory] = useUpdateHistory(operationId);
  const [getStepInfo] = useStepInfo();
  const { data: border } = useBorderInfo(operationId);
  const [skipTransport, { loading: loadingSkipTransport }] = useSkipTransport(operationId);
  const [additionalDocs, setAdditionalDocs] = useState<FileDropZone[]>([]);
  const { data } = useWarehouses();
  const schema = yup.object({
    trafficNumber: yup.string().required(t('broker.trafficNumberSchema')),
    economicNumber: yup.string().required(t('broker.economicNumberSchema')),
    driver: yup.string().required(t('broker.driverSchema')),
    vehicleType: yup.string().required(t('broker.vehicleTypeSchema')),
    warehouse: yup.object({}).required(t('broker.warehouseSchema')),
    notes: yup.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    getValues,
    reset,
  } = useForm<FieldValues>({
    resolver: yupResolver(schema) as any,
  });

  useEffect(() => {
    const getStepData = async () => {
      const { data: stepInfo } = await getStepInfo({
        variables: {
          id: operationId,
          step: 7,
        },
      });

      reset({
        ...stepInfo?.getStepInfo,
      });

      setOldValue({
        ...stepInfo?.getStepInfo,
      } as ArrivalWarehouseMx);
    };
    if (isEdit) {
      getStepData();
    }
  }, [getStepInfo, isEdit, operationId, reset]);

  useEffect(() => {
    setValue('trafficNumber', border?.borderInfo?.trafficNumber ?? null);
    setValue('economicNumber', border?.borderInfo?.economicNumber ?? null);
    setValue('driver', border?.borderInfo?.driver ?? null);
    setValue('vehicleType', border?.borderInfo?.vehicleType ?? null);
  });

  const submitHandler = async ({
    trafficNumber,
    economicNumber,
    driver,
    vehicleType,
    warehouse,
    notes,
  }: FieldValues) => {
    let additionalFiles = null;
    if (additionalDocs.length) {
      const files = await uploadFiles(additionalDocs);
      if (Array.isArray(files)) {
        additionalFiles = createArrayFiles(files);
      }
    }

    if (isEdit) {
      const newValue = {
        trafficNumber,
        economicNumber,
        driver,
        vehicleType,
        warehouse,
        notes,
      };

      const changes = difference<ArrivalWarehouseMx>(oldValue!, newValue);

      await updateHistory({
        variables: {
          id: operationId,
          notes,
          trafficNumber,
          additionalFiles,
          economicNumber,
          driver,
          vehicleType,
          step: 7,
          warehouse,
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
        warehouse,
        notes,
        additionalFiles,
        step: 7,
      },
      onError: (error) => {
        if (error?.graphQLErrors[0]?.extensions.key) {
          setSnackBar('error', t(`broker.${error.graphQLErrors[0].extensions.key}`));
        } else {
          setSnackBar('error', t('broker.arrivalWarehouseMxError'));
        }
      },
      onCompleted: () => {
        setSnackBar('success', t('broker.arrivalWarehouseMxSuccess'));
        submitFrom();
      },
    });
  };

  const handleSkipTransport = async () => {
    const { notes, warehouse } = getValues();

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
        warehouse,
        step: 7,
        isEdit,
      },
      onError: (error) => {
        if (error?.graphQLErrors[0]?.extensions.key) {
          setSnackBar('error', t(`broker.${error.graphQLErrors[0].extensions.key}`));
        } else {
          setSnackBar('error', t('broker.transportCollectionError'));
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
      <form autoComplete="off" onSubmit={handleSubmit(submitHandler)}>
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
          >
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Stack spacing={2} sx={{ p: 1 }}>
                <ControlledTextField
                  fieldName="trafficNumber"
                  errors={errors}
                  inputType="text"
                  disabled
                  label={`${t('broker.trafficNumberLabel')} *`}
                  register={register}
                  key="trafficNumber-field"
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
                <ControlledAutocomplete
                  errors={errors}
                  name="warehouse"
                  label={`${t('broker.warehouseLabel')} *`}
                  control={control}
                  options={data?.findAllWarehouses ?? []}
                  key="warehouse-autocomplete"
                  optionLabel={({ name }: AutoComplete) => name}
                  valueSerializer={({ name, distributionChannel, salesOffice }: AutoComplete) => ({
                    name,
                    distributionChannel,
                    salesOffice,
                  })}
                  disabled={isOnlyView}
                />
                <ControlledTextField
                  fieldName="notes"
                  errors={errors}
                  inputType="text"
                  label={t('broker.notesLabel')}
                  register={register}
                  key="notes-field"
                  disabled={isOnlyView}
                />
              </Stack>
            </Grid>
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
            <LoadingButton
              variant="outlined"
              loading={loadingSkipTransport}
              color="secondary"
              onClick={handleSkipTransport}
              disabled={isOnlyView}
            >
              {t('broker.skipTransport')}
            </LoadingButton>
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
