import { Grid, Stack, Container } from '@mui/material';
import Button from '@mui/lab/LoadingButton';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { t } from 'i18next';

import {
  ControlledTextField,
} from '@gsuite/shared/ui';
import { HorizontalStepper } from '@gsuite/ui/Stepper';
import { useCreateRole } from '../api/createRole';
import { useUpdateRole } from '../api/updateRole';
import hookForm from '../hooks/useForm';
import { schema } from '../types';
import Permits from './Permits';

type Props = {
  roleId?: string;
  onClose: () => void;
};

export default function Form({
  roleId,
  onClose,
}: Props) {
  const { mutateAsync: createRole } = useCreateRole();
  const { mutateAsync: updateRole } = useUpdateRole();
  const {
    onChangeNotifications,
    onChangeModules,
    modules,
    notifications,
    roleName,
  } = hookForm({ roleId });

  const { register, formState: { errors }, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: roleName,
    },
  });

  const isUpdate = roleId && roleId !== 'create';
  const onSubmit = (data: { name: string }) => {
    const modulesChecked = modules.map((m) => {
      const checkedPermissions = m.permissions.filter((p) => p.checked === true);

      if (checkedPermissions.length > 0) {
        return { ...m, permissions: checkedPermissions };
      }

      return null;
    }).filter(Boolean);
    const notificationsChecked = notifications.notifications.map((n) => {
      const checkedPermissions = n.permissions.filter((p) => p.checked === true);

      if (checkedPermissions.length > 0) {
        return { ...n, permissions: checkedPermissions };
      }

      return null;
    }).filter(Boolean);
    if (isUpdate) {
      updateRole({
        data: {
          ...data,
          id: roleId,
          modules: modulesChecked,
          notifications: {
            email: notifications.email,
            whatsapp: notifications.whatsapp,
            notifications: notificationsChecked,
          },
        },
      });
    } else {
      createRole({
        data: {
          ...data,
          modules: modulesChecked,
          notifications: {
            email: notifications.email,
            whatsapp: notifications.whatsapp,
            notifications: notificationsChecked,
          },
        },
      });
    }
    onClose();
  };

  const steps = [
    {
      name: t('managements.roles.step_1'),
      body: (
        <Container maxWidth="lg">
          <Grid
            container
            spacing={2}
            sx={{
              padding: 0,
            }}
          >
            <Grid item lg={12} md={12} sm={12} xs={12}>
              {modules.map(({ name, key, permissions }, i) => (
                <Permits
                  key={`${name}-${i + 1}`}
                  keyName={key}
                  i={i}
                  checked={permissions.every(({ checked }) => checked)}
                  name={name}
                  onChange={onChangeModules}
                  permissions={permissions}
                />
              ))}
            </Grid>
          </Grid>
        </Container>
      ),
    },
    {
      name: t('managements.roles.step_2'),
      body: (
        <Container maxWidth="lg">
          <Grid
            container
            spacing={2}
            sx={{
              padding: 0,
            }}
          >
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Stack spacing={3} sx={{ p: 2 }} direction="row">
                <Permits
                  key="email"
                  i={0}
                  keyName="email"
                  name="email"
                  onChange={onChangeNotifications}
                  checked={notifications.email}
                />
                <Permits
                  key="whatsapp"
                  keyName="whatsapp"
                  i={0}
                  name="whatsapp"
                  onChange={onChangeNotifications}
                  checked={notifications.whatsapp}
                />
              </Stack>
              {notifications.notifications.map(({ name, key, permissions }, i) => (
                <Permits
                  key={`${name}-${i + 1}`}
                  keyName={key ?? name}
                  i={i}
                  name={name}
                  permissions={permissions}
                  checked={permissions.every(({ checked }) => checked)}
                  onChange={onChangeNotifications}
                />
              ))}
            </Grid>
          </Grid>
        </Container>
      ),
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item spacing={4} lg={12} md={12} sm={12} xs={12}>
          <Stack spacing={3} sx={{ p: 2 }} direction="row">
            <ControlledTextField
              label="Nombre del rol"
              register={register}
              inputType="text"
              errors={errors}
              fieldName="name"
              key="name-field"
            />
          </Stack>
        </Grid>
        <Grid lg={12} md={12} sm={12} xs={12}>
          <Stack spacing={3} sx={{ p: 2, height: '100vh' }} direction="row">
            <HorizontalStepper
              steps={steps}
              onClose={onClose}
              onSubmitButton={(
                <Button
                  type="submit"
                  variant="contained"
                >
                  {isUpdate ? t('managements.roles.editRole') : t('managements.roles.addRole')}
                </Button>
              )}
            />
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}
