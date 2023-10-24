import { useEffect } from 'react';
import Drawer from '@mui/material/Drawer';

import { SubmitHandler } from 'react-hook-form';

import { useFormWithSchema } from '@gsuite/shared/lib/react-hook-form';

import useResponsive from '@gsuite/shared/hooks/useResponsive';
import AreaForm from './AreaForm';
import { useUpdateArea } from '../api/updateArea';
import { useGetArea } from '../api/getArea';
import { areaSchema, Area, UpdateDrawerProps } from '../types';

export default function UpdateAreaDrawer({
  open, onClose, areaId,
}: UpdateDrawerProps) {
  const areaQuery = useGetArea({ areaId });
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useFormWithSchema(areaSchema, { mode: 'onBlur' });

  const { mutateAsync } = useUpdateArea();

  const onSubmit: SubmitHandler<Area> = async (data) => {
    await mutateAsync({ data, areaId });

    reset();
    onClose();
  };

  useEffect(() => {
    if (areaQuery.data) {
      const newData = areaQuery.data;
      if (newData?.department) {
        newData.department = {
          id: areaQuery.data?.department.id,
          name: areaQuery.data?.department.name,
        };
        reset(newData);
      }
      reset(newData);
    }
  }, [reset, areaQuery.data]);

  const isDesktop = useResponsive('up', 'lg');

  return (
    <Drawer
      open={open}
      onClose={onClose}
      PaperProps={isDesktop ? {
        sx: {
          width: '33%',
        },
      } : {
        sx: {
          width: '90%',
        },
      }}
      anchor="right"
      ModalProps={{
        keepMounted: false,
      }}
    >
      <AreaForm
        data={areaQuery?.data || null}
        handleSubmit={handleSubmit(onSubmit)}
        control={control}
        errors={errors}
        register={register}
        isSubmitting={isSubmitting}
        isEditing={Boolean(areaId)}
      />
    </Drawer>
  );
}
