// Arrival USA
import {
  useState, useContext, useEffect,
} from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import {
  DialogContent, DialogActions, Button, Stack, Grid, Container,
} from '@mui/material';
import { FieldValues, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';

import { ControlledTextField, Dropzone } from '@/components';
import { NotificationsContext } from '@/contexts/NotificationsContext';
import { FileDropZone } from '@/typings/files';
import STEPS_NAMES from '../../utils/constants';

import { uploadFiles, createArrayFiles } from '@/services/uploadFiles';
import { useAddHistory, useUpdateHistory } from '../../hooks/operation-detail';
import { useStepInfo, InfoStep } from '../../hooks/stepInfo';
import { difference } from '@/utils/func';

type Props = {
  submitFrom: () => void;
  onClose: () => void;
  operationId: string;
  isEdit: boolean;
  isOnlyView: boolean;
};

interface ArrivalUsa extends Record<string, unknown> {
  pickupAppointment: Date;
  references: string;
  notes: string;
}

export function ArrivalEEUU({
  submitFrom,
  onClose,
  operationId,
  isEdit = false,
  isOnlyView,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const { ARRIVAL_EEUU } = STEPS_NAMES;
  const [addHistory, { loading }] = useAddHistory(operationId);
  const [updateHistory] = useUpdateHistory(operationId);
  const [getStepInfo] = useStepInfo();
  const { setSnackBar } = useContext(NotificationsContext);
  const [oldValue, setOldValue] = useState<ArrivalUsa>();
  const [additionalDocs, setAdditionalDocs] = useState<FileDropZone[]>([]);
  const schema = Yup.object({
    pickupAppointment: Yup.date().typeError(t('broker.pickupAppointmentSchema')).required(t('broker.pickupAppointmentSchema')),
    references: Yup.string(),
    notes: Yup.string(),
  });

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: yupResolver(schema) as any,
  });

  useEffect(() => {
    const getInfoEdit = async (): Promise<InfoStep | null> => {
      try {
        const { data: stepInfo } = await getStepInfo({
          variables: {
            id: operationId,
            step: ARRIVAL_EEUU,
          },
        });
        if (stepInfo?.getStepInfo) return stepInfo.getStepInfo;
        return null;
      } catch (error) {
        return null;
      }
    };
    if (isEdit && !getValues('pickupAppointment')) {
      getInfoEdit().then((data) => {
        if (!data) return;
        const {
          pickupAppointment,
          references,
          notes,
        } = data;

        reset({
          pickupAppointment: dayjs(pickupAppointment).format('YYYY-MM-DD').toString(),
          references,
          notes,
        });

        setOldValue({
          pickupAppointment: new Date(pickupAppointment),
          references,
          notes,
        });
      });
    }
  }, [ARRIVAL_EEUU, getStepInfo, getValues, isEdit, operationId, reset]);

  const submitHandler = async ({
    pickupAppointment, references, notes,
  }: FieldValues) => {
    let additionalFiles = null;
    if (additionalDocs.length) {
      const files = await uploadFiles(additionalDocs);
      if (Array.isArray(files)) {
        additionalFiles = createArrayFiles(files);
      }
    }
    const date = new Date(pickupAppointment);
    const dateTmp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    const stepData = {
      id: operationId,
      references,
      pickupAppointment,
      additionalFiles,
      notes,
      step: ARRIVAL_EEUU,
    };

    if (isEdit) {
      const newValue: ArrivalUsa = {
        pickupAppointment: new Date(dateTmp),
        references,
        notes,
      };
      const changes = difference<ArrivalUsa>(
        oldValue as ArrivalUsa,
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
          setSnackBar('success', t('broker.updateStepSuccess'));
          submitFrom();
        },
      });
      onClose();
      return;
    }

    await addHistory({
      variables: stepData,
      onError: () => {
        setSnackBar('error', t('broker.arrivalUsaError'));
      },
      onCompleted: () => {
        setSnackBar('success', t('broker.arrivalUsaSuccess'));
        submitFrom();
      },
    });
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
                <ControlledTextField
                  errors={errors}
                  fieldName="pickupAppointment"
                  inputType="date"
                  label={`${t('broker.pickupAppointmentLabel')} *`}
                  register={register}
                  key="pickupAppointment-field"
                  disabled={isOnlyView}
                />
                <ControlledTextField
                  errors={errors}
                  fieldName="references"
                  inputType="text"
                  label={t('broker.referencesLabel')}
                  register={register}
                  key="references-field"
                  disabled={isOnlyView}
                />
              </Stack>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Stack spacing={2} sx={{ pt: 1 }}>
                <ControlledTextField
                  errors={errors}
                  fieldName="notes"
                  inputType="text"
                  label={t('broker.notesLabel')}
                  register={register}
                  key="notes-field"
                  disabled={isOnlyView}
                />
              </Stack>
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Dropzone
                label={t('broker.additionalFiles')}
                files={additionalDocs}
                filesSetter={setAdditionalDocs}
                key="additionalDocs-field"
                disabled={isOnlyView}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('cancel')}</Button>
          <LoadingButton variant="contained" type="submit" loading={loading} disabled={false}>
            {isEdit ? t('update') : t('register')}
          </LoadingButton>
        </DialogActions>
      </form>
    </Container>
  );
}
