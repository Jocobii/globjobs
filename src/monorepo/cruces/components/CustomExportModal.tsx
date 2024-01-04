import { Dialogeazy } from '@gsuite/ui/Dialogeazy';
import {
  Stack, Typography, Box,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useFindCompany } from '@gsuite/shared/services/cruces';
import DownloadIcon from '@mui/icons-material/Download';
import { ControlledTextField, ControlledAutocomplete } from '@gsuite/shared/ui';
import { useSnackNotification } from '@gsuite/shared/hooks';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { reportCrossing } from '@gsuite/shared/services/cruces/reportCrossing';

type Props = {
  open: boolean;
  onClose: () => void;
};

type AutoComplete = {
  id: string;
  name: string;
  number: string;
};

export default function CustomExportDrawer({ open, onClose }: Props) {
  const { debouncedCompany, data: companyResult } = useFindCompany();
  const { errorMessage, successMessage } = useSnackNotification();
  const schema = yup.object().shape({
    client: yup.array().of(yup.string()).required('El cliente es requerido').min(1, 'El cliente es requerido'),
    startDate: yup.date().nullable().default(null).transform((curr, orig) => (orig === '' ? null : curr)),
    endDate: yup
      .date()
      .nullable()
      .default(null)
      .transform((curr, orig) => (orig === '' ? null : curr)),
  });

  const {
    register,
    getValues,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(schema),
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDownload = async () => {
    const { client, startDate, endDate } = getValues();
    try {
      const fileResponse = await reportCrossing(client as string[], startDate as Date, endDate as Date);
      if (fileResponse && fileResponse.size > 0) {
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(fileResponse);
        link.href = url;
        link.setAttribute('download', `CROSSING-${Date.now()}`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        successMessage('Se ha generado el reporte');
        return handleClose();
      }

      errorMessage('Algo salio mal en la generación del layout');
      return handleClose();
    } catch (err) {
      return errorMessage('Algo salio mal en la generación del layout');
    }
  };

  return (
    <Dialogeazy
      open={open}
      onClose={handleClose}
    >
      <Stack
        direction="column"
        justifyContent="start"
        alignItems="center"
        sx={{ height: '100%' }}
      >
        <Typography variant="h3" sx={{ margin: 3 }}>Reporte de Operaciones</Typography>
        <form style={{ width: '100%', height: '100%' }}>
          <Stack spacing={2} sx={{ margin: 3, height: '90%' }}>
            <ControlledAutocomplete
              multiple
              errors={errors}
              name="client"
              options={companyResult?.companiesFind ?? []}
              label="Ingresa nombre o numero del cliente"
              control={control}
              freeSolo
              key="client-autocomplete"
              optionLabel={(clientValue: AutoComplete) => {
                if (clientValue) return `${clientValue?.number} - ${clientValue?.name}`;
                return null;
              }}
              valueSerializer={(clientValue: AutoComplete[]) => {
                if (clientValue) {
                  return clientValue.map((e) => e.number);
                }
                return {};
              }}
              customOnChange={(value) => {
                if (value) debouncedCompany(value);
              }}
            />
            <ControlledTextField
              fieldName="startDate"
              label="Fecha inicial"
              errors={errors}
              defaultValue={undefined}
              register={register}
              inputType="date"
            />
            <ControlledTextField
              fieldName="endDate"
              label="Fecha final"
              defaultValue={undefined}
              errors={errors}
              register={register}
              inputType="date"
            />
          </Stack>
        </form>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            padding: 3,
          }}
        >
          <LoadingButton
            variant="outlined"
            color="primary"
            onClick={handleDownload}
            type="submit"
            sx={{ width: '70' }}
            startIcon={<DownloadIcon />}
          >
            Descargar reporte
          </LoadingButton>
        </Box>
      </Stack>
    </Dialogeazy>
  );
}
