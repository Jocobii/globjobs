import { ControlledTextField } from '@gsuite/shared/ui';
import * as yup from 'yup';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Stack } from '@mui/material';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { useUpdateCruceHistory } from '@gsuite/shared/services/cruces/update-history';
import { useParams } from 'react-router-dom';

type Params = {
  id: string;
};

export function CommentInput() {
  const schema = yup.object().shape({
    comments: yup.string().max(150, 'El comentario no puede tener más de 150 caracteres'),
  });
  const { id } = useParams<keyof Params>() as Params;
  const { successMessage, errorMessage } = useSnackNotification();
  const {
    register,
    getValues,
    resetField,
    formState: { errors, isValid },
  } = useForm<FieldValues>({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const { updateHistory } = useUpdateCruceHistory();
  const handleSubmit = () => {
    const comments = getValues('comments');
    updateHistory({
      variables: {
        operation: {
          id,
          action: 'user_message',
          comments,
        },
      },
      onError: () => errorMessage('Ocurrió un error el comentario'),
      onCompleted: () => {
        successMessage('Comentario agregado');
        resetField('comments');
      },
      context: { clientName: 'globalization' },
    });
  };

  return (
    <>
      <ControlledTextField
        label=""
        multiline
        minRows={4}
        register={register}
        inputType=""
        errors={errors}
        fieldName="comments"
        key="patente-field"
        sx={{
          width: '100%',
          border: 'none',
        }}
      />
      <Stack
        direction="row-reverse"
        alignItems="center"
        sx={{ width: '100%', marginTop: 1 }}
        spacing={2}
      >
        <Button disabled={!isValid} sx={{ marginTop: 1 }} onClick={handleSubmit} variant="contained">Enviar</Button>
      </Stack>
    </>
  );
}
