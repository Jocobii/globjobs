import Drawer from '@mui/material/Drawer';
import * as Yup from 'yup';

import { SubmitHandler, useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Form from './form';
import { useCreateModule } from '../api/createModule';

type Props = {
  open: boolean;
  onClose: () => void;
};

const DRAWER_WIDTH = 600;

const errMessage = 'Field is required';

export default function Create({ open, onClose }: Props) {
  const { mutateAsync } = useCreateModule();
  const schema = Yup.object({
    name: Yup.string().required(errMessage),
    description: Yup.string().required(errMessage),
    route: Yup.string().required(errMessage),
    component: Yup.string().required(errMessage),
    icon: Yup.string().required(errMessage),
    exact: Yup.bool(),
    toolbox: Yup.bool(),
    actions: Yup.array().of(
      Yup.object().shape({
        id: Yup.string(),
        name: Yup.string(),
      }),
    ).min(1).required(),
    environment: Yup.object().shape({
      id: Yup.string(),
      name: Yup.string(),
    }).required(),
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    control,

  } = useForm<FieldValues>({
    resolver: yupResolver(schema) as any,
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    await mutateAsync({ data });
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
      />
    </Drawer>
  );
}
