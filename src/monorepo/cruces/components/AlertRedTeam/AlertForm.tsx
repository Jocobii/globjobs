import { Grid, Typography } from '@mui/material';
import { ControlledAutocomplete, ControlledTextField, Dropzone } from '@gsuite/shared/ui';
import { useState } from 'react';
import { AlertCreateFormProps } from '../../types';
import { useGetUsers } from '../../services/getUsersRedTeam';

type AutoComplete = {
  id: string;
  name: string;
};

const ANDEN = [
  {
    id: '01',
    name: '1',
  },
  {
    id: '02',
    name: '2',
  },
  {
    id: '03',
    name: '3',
  },
  {
    id: '04',
    name: '4',
  },
  {
    id: '05',
    name: '5',
  },
  {
    id: '06',
    name: '6',
  },
  {
    id: '07',
    name: '7',
  },
  {
    id: '08',
    name: '8',
  },
  {
    id: '09',
    name: '9',
  },
  {
    id: '10',
    name: '10',
  },
];

export default function AlertForm({
  control,
  register,
  errors,
  files,
  filesSetter,
}:AlertCreateFormProps) {
  const [variables] = useState({ teamId: '63ed129fa6575a98cf8bbd3b' });

  const query = useGetUsers({ variables });

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Datos
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <ControlledAutocomplete
            errors={errors}
            name="anden"
            label="Anden"
            options={ANDEN || []}
            key="anden-autocomplete"
            optionLabel={(departmentValue: AutoComplete) => {
              if (departmentValue) {
                return departmentValue?.name;
              }
              return null;
            }}
            valueSerializer={(value: AutoComplete) => {
              if (value) {
                const { name, id } = value;
                return {
                  name,
                  id,
                };
              }
              return null;
            }}
            control={control}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ControlledAutocomplete
            errors={errors}
            name="checker"
            label="Verificador"
            options={query.data || []}
            key="checker-autocomplete"
            optionLabel={(value: AutoComplete) => {
              if (value) {
                return value?.name;
              }
              return null;
            }}
            valueSerializer={(value: AutoComplete) => {
              if (value) {
                const { name, id } = value;
                return {
                  name,
                  id,
                };
              }
              return null;
            }}
            control={control}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <ControlledTextField
            label="Comentarios adicionales"
            fieldName="additionalComment"
            multiline
            minRows={3}
            errors={errors}
            register={register}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Dropzone
            label="Archivos"
            files={files}
            filesSetter={filesSetter}
          />
        </Grid>
      </Grid>
    </>
  );
}
