import Drawer from '@mui/material/Drawer';
import * as Yup from 'yup';

import { SubmitHandler, useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Form from './form';
import { useCreateMenu } from '../api/createMenu';

type Props = {
  open: boolean;
  onClose: () => void;
};

const DRAWER_WIDTH = 600;

const errMessage = 'Field is required';
type SelectOption = {
  id: string;
  name: string;
};

export default function Create({ open, onClose }: Props) {
  const { createMenu } = useCreateMenu();
  const schema = Yup.object({
    name: Yup.string().required(errMessage),
    modules: Yup.array().of(
      Yup.object().shape({
        id: Yup.string(),
        name: Yup.string(),
      }),
    ).min(1).required(),
    environment: Yup.object().shape({
      id: Yup.string(),
      name: Yup.string(),
    }).required(),
    icon: Yup.string(),
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    control,
    getValues,
    setValue,
    watch,
  } = useForm<FieldValues>({
    resolver: yupResolver(schema) as any,
  });

  watch((formValues: FieldValues) => {
    const { modules } = formValues;
    if (modules && modules.length === 1 && getValues('name') !== modules[0].name) {
      setValue('name', modules[0].name);
    }
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    console.log('data form data', data);
    await createMenu({ variables: {
      name: data.name,
      icon: data.icon,
      modules: data.modules.map(({ id }: SelectOption) => id),
      environment: data.environment,
    }});
    reset();
    onClose();
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { pb: 5, width: DRAWER_WIDTH } }}
      anchor="right"
      ModalProps={{
        keepMounted: false,
      }}
    >
      <Form
        handleSubmit={handleSubmit(onSubmit)}
        errors={errors}
        register={register}
        control={control}
        isSubmitting={isSubmitting}
        watch={watch}
      />
    </Drawer>
  );
}
