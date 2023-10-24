import Drawer from '@mui/material/Drawer';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { SubmitHandler, useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Form from './form';
import { useUpdateMenu } from '../api/updateMenu';
import { useGetMenu } from '../api/getMenu';

type Props = {
  open: boolean;
  onClose: () => void;
  rowId: string,
};

const DRAWER_WIDTH = 600;

const errMessage = 'Field is required';

export default function Update({ open, onClose, rowId }: Props) {
  const menuQuery = useGetMenu({ id: rowId });
  const { mutateAsync } = useUpdateMenu({ menuId: rowId });
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
    icon: Yup.string().required(errMessage),
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
    resolver: yupResolver(schema),
  });

  watch((formValues: FieldValues) => {
    const { modules } = formValues;
    if (modules && modules.length === 1 && getValues('name') !== modules[0].name) {
      setValue('name', modules[0].name);
    }
  });

  useEffect(() => {
    if (menuQuery.data) {
      const { modules, environment } = menuQuery.data;
      const newData = menuQuery.data;
      newData.modules = modules;
      newData.environment = (environment && {
        id: environment.id,
        name: environment.name,
      }) || null;
      reset(newData);
    }
  }, [reset, menuQuery.data]);

  const onSubmit: SubmitHandler<any> = async (data) => {
    await mutateAsync({ data, menuId: rowId });
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
        data={menuQuery.data}
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
