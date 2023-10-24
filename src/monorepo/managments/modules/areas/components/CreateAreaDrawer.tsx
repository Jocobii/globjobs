import Drawer from '@mui/material/Drawer';
import { SubmitHandler } from 'react-hook-form';
import { useFormWithSchema } from '@gsuite/shared/lib/react-hook-form';
import useResponsive from '@gsuite/shared/hooks/useResponsive';
import AreaForm from './AreaForm';
import { useCreateArea } from '../api/createArea';
import { areaSchema, Area, CreateDrawerProps } from '../types';

export default function CreateAreaDrawer({ open, onClose }: CreateDrawerProps) {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useFormWithSchema(areaSchema);
  const { mutateAsync } = useCreateArea();

  const onSubmit: SubmitHandler<Area> = async (data) => {
    await mutateAsync({ data });

    reset();
    onClose();
  };

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
        handleSubmit={handleSubmit(onSubmit)}
        control={control}
        errors={errors}
        register={register}
        isSubmitting={isSubmitting}
      />
    </Drawer>
  );
}
