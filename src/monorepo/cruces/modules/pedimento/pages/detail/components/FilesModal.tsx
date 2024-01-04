import { Dropzone, DialogComponent, ControlledTextField } from '@gsuite/shared/ui';
import {
  DialogContent, Stack, Box, DialogActions, Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import * as yup from 'yup';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { usePedimento } from '../hooks/usePedimento';
import Tagger from './Tagger';
import ProformaModal from './ProformaModal';

interface Props {
  open: boolean;
  handleClose: () => void;
  refetch: () => void;
}

export function FilesModal({ open, handleClose, refetch }: Props) {
  const schema = yup.object().shape({
    comments: yup.string().max(150, 'El comentario debe tener como máximo 150 caracteres'),
  });
  const {
    step, backStep, clearAllSteps,
    files, setFiles,
    handleSubmit,
    setValuesForms,
    hasProforma,
    disabled,
    setDisabled,
  } = usePedimento();
  const {
    formState: { errors },
    register,
    getValues,
    resetField,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleNext = () => {
    if (step === 0) {
      setValuesForms(getValues());
    }

    handleSubmit(handleClose, refetch);
  };

  const onClose = () => {
    handleClose();
    resetField('comments');
    clearAllSteps();
  };

  const catchProformaMount = (value: number) => {
    setValuesForms((prev: any) => ({ ...prev, amount: value }));
  };

  return (
    <DialogComponent
      maxWidth="md"
      fullWidth
      open={open}
      title="Agregar Archivos"
      handleClose={onClose}
      okButtonVisibility={false}
      cancelButtonVisibility={false}
    >
      {
        step === 0 ? (
          <DialogContent>
            <Box sx={{ width: '100%' }}>
              <Stack spacing={2}>
                <Dropzone
                  label="Agregar Archivo"
                  files={files}
                  filesSetter={setFiles}
                />
                <ControlledTextField
                  label="Comentarios"
                  register={register}
                  inputType="text"
                  errors={errors}
                  fieldName="comments"
                  key="comments-keys"
                />
              </Stack>
            </Box>
          </DialogContent>
        ) : <p> </p>
      }
      {
        step === 1 ? (
          <DialogContent>
            <Tagger
              files={files}
              setFiles={setFiles}
            />
          </DialogContent>
        ) : <p> </p>
      }
      {
        step === 2 && hasProforma ? (
          <DialogContent>
            <ProformaModal
              setDisabled={setDisabled}
              setValFile={() => {}}
              setAmount={catchProformaMount}
              setFiles={setFiles}
            />
          </DialogContent>
        ) : <p> </p>
      }
      <DialogActions>
        <Button
          sx={{ borderRadius: 5 }}
          variant="outlined"
          onClick={onClose}
        >
          Cancelar
        </Button>
        <Button
          sx={{ borderRadius: 5 }}
          variant="outlined"
          onClick={backStep}
        >
          Anterior
        </Button>
        <LoadingButton
          onClick={handleNext}
          disabled={disabled}
          sx={{ borderRadius: 5 }}
          variant="contained"
          type="submit"
        >
          Siguiente
        </LoadingButton>
      </DialogActions>
    </DialogComponent>
  );
}
