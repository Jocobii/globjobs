import { useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import * as Yup from 'yup';

import { SubmitHandler, useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { capitalizeFirstLetter } from '@gsuite/shared/utils/format';
import Form from './form';
import { useUpdateModule } from '../api/updateModule';
import { useGetModule } from '../api/getModule';

type Props = {
  open: boolean;
  onClose: () => void;
  rowId: string,
};

const DRAWER_WIDTH = 600;

const errMessage = 'Field is required';

export default function Update({ open, onClose, rowId }: Props) {
  const moduleQuery = useGetModule({ id: rowId });
  const { mutateAsync } = useUpdateModule({ moduleId: rowId });
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
      id: Yup.string().required(errMessage),
      name: Yup.string().required(errMessage),
    }).required(errMessage),
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FieldValues>({
    mode: 'onBlur',
    resolver: yupResolver(schema) as any,
  });

  useEffect(() => {
    if (moduleQuery.data) {
      const { actions, environment } = moduleQuery.data;
      const newData = moduleQuery.data;
      newData.actions = actions.map((action: string) => {
        if (typeof action !== 'string') return action;
        return {
          id: action,
          name: capitalizeFirstLetter(action),
        };
      });
      newData.environment = (environment && {
        id: environment.id,
        name: environment.name,
      }) || null;
      reset(newData);
    }
  }, [reset, moduleQuery.data]);

  const onSubmit: SubmitHandler<any> = async (data) => {
    await mutateAsync({ data, moduleId: rowId });
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
        data={moduleQuery.data}
        handleSubmit={handleSubmit(onSubmit)}
        errors={errors}
        register={register}
        control={control}
        isSubmitting={isSubmitting}
      />
    </Drawer>
  );
}
