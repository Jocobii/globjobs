import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import DialogComponent from '@gsuite/shared/ui/DialogComponent';
import { ControlledTextField } from '@gsuite/shared/ui';
import { Grid, Stack } from '@mui/material';
import * as yup from 'yup';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useReasonDelayCrossing } from '@gsuite/shared/services/cruces/resolve-delay';
import { StatusHistory } from '../../services/cruce-detail';

type Props = {
  statusHistory: StatusHistory[];
  crossingId: string;
  refetch: () => void;
};

export default function CancelCruceModal({
  statusHistory,
  crossingId,
  refetch,
}: Readonly<Props>) {
  const isDelay = (): boolean => {
    if (!Array.isArray(statusHistory) || statusHistory.length === 0) return false;
    const lastStatus = statusHistory[statusHistory.length - 1];
    if (lastStatus.resolved) return false;
    const lastStatusDate = dayjs(lastStatus?.startedAt);
    const now = dayjs();
    const minutes = now.diff(lastStatusDate, 'm');
    return minutes >= 30;
  };
  const [needReason, setIsDelay] = useState(isDelay());
  const schema = yup.object().shape({
    comments: yup.string().required('La razon de la demora es requerida'),
  });
  useEffect(() => {
    setIsDelay(isDelay());
  }, [statusHistory]);

  const { successMessage } = useSnackNotification();
  const [handleReasonDelay] = useReasonDelayCrossing();
  const {
    register,
    getValues,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const handleConfirm = () => {
    const { comments } = getValues();
    handleReasonDelay({
      variables: {
        crossingId,
        reason: comments,
      },
      onCompleted: () => {
        refetch();
        setIsDelay(false);
        successMessage('Se ha registrado la razón de la demora');
      },
    });
  };
  return (
    <DialogComponent
      title="Motivo de la demora"
      open={needReason}
      handleConfirm={handleConfirm}
      okText="Confirmar"
      cancelText="Cancelar"
      maxWidth="md"
    >
      <Grid
        container
        spacing={2}
        sx={{
          padding: 0,
        }}
      >
        <Grid item>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <ControlledTextField
              label="Comentarios"
              register={register}
              inputType="text"
              errors={errors}
              multiline
              minRows={5}
              fieldName="comments"
              key="comments-field"
            />
          </Stack>
        </Grid>
      </Grid>
    </DialogComponent>
  );
}
