import { useEffect } from 'react';
import { Dialogeazy } from '@gsuite/ui/Dialogeazy';
import {
  Stack, Typography, Button,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ControlledTextField, ControlledAutocomplete, LoadingScreen } from '@/components';
import { useCreateArea, useUpdateArea, useGetArea } from '../api';
import { useRestfulDepartments } from '../../departments/api/restful';
import { areaSchema, Area } from '../types';

export type CreateDrawerProps = {
  open: boolean;
  onClose: () => void;
  areaId?: string;
};

type AutoComplete = {
  id: string;
  name: string;
};

export function DrawerForm({ open, onClose, areaId = undefined }: CreateDrawerProps) {
  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm<Area>({
    mode: 'onChange',
    resolver: yupResolver(areaSchema),
  });
  console.log('errors', errors, open);
  const { data } = useGetArea({ areaId });
  const { mutateAsync: updateArea } = useUpdateArea();
  const { mutateAsync: createArea } = useCreateArea();
  const { data: departmentsData } = useRestfulDepartments();
  const isUpdate = areaId && areaId !== 'create';
  console.log('isUpdate', isUpdate, areaId);
  const onSubmit = (data: Area) => {
    console.log('onSubmit', data);
    if (isUpdate) {
      updateArea({ data, areaId });
    } else {
      createArea({ data });
    }
    reset();
    onClose();
  };
  useEffect(() => {
    if (!data) return;
    setValue('name', data?.area.name);
    setValue('abbreviation', data?.area.abbreviation);
    setValue('department', data?.area.department);
  }, [data, setValue]);

  if (areaId && areaId !== 'create' && !data) {
    return <LoadingScreen />;
  }

  return (
    <Dialogeazy
      open={open}
      onClose={onClose}
    >
      <Stack
        direction="column"
        justifyContent="start"
        alignItems="center"
        sx={{ height: '100%' }}
      >
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', height: '100%' }}>
          <Stack spacing={2} sx={{ margin: 3, height: '90%' }}>
            <Typography variant="h3">{isUpdate ? 'Actualizar Area' : 'Agregar Area'}</Typography>
            <ControlledTextField
              fieldName="name"
              defaultValue={data?.area.name}
              label="Nombre"
              errors={errors}
              register={register}
            />
            <ControlledTextField
              fieldName="abbreviation"
              label="Abreviación"
              defaultValue={data?.area.abbreviation}
              errors={errors}
              register={register}
            />
            <ControlledAutocomplete
              errors={errors}
              defaultValue={data?.area.department || null}
              name="department"
              label="Departamento"
              control={control}
              options={departmentsData?.departmentsRestful || []}
              key="departments-autocomplete"
              optionLabel={(departmentValue: AutoComplete) => {
                if (!departmentValue) return null;
                return departmentValue?.name;
              }}
              valueSerializer={(departmentValue: AutoComplete) => {
                if (!departmentValue) return null;
                const { name, id } = departmentValue;
                return {
                  name,
                  id,
                };
              }}
            />
          </Stack>
          <Button type="submit" variant="contained" sx={{ width: '100%' }}>{isUpdate ? 'Actualizar' : 'Agregar'}</Button>
        </form>
      </Stack>
    </Dialogeazy>
  );
}

export default DrawerForm;
