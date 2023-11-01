import {
  Grid,
  Card,
  Stack,
  Typography,
} from '@mui/material';
import Button from '@mui/lab/LoadingButton';
import { t } from 'i18next';
import { SubmitHandler, useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Scrollbar from '@gsuite/ui/Scrollbar';
import { ControlledTextField, ControlledAutocomplete } from '@gsuite/shared/ui';
import { useGetMenu } from '../api/getMenu';
import { Menu, menuSchema, Options } from '../types';
import { useForm as useForms } from '../hooks/useForm';
import { useEffect } from 'react';

type Props = {
  onSubmit: SubmitHandler<Menu>;
  rowId?: string,
  initialValues?: Menu,
};

export default function Update({ rowId, onSubmit }: Props) {
  const { data } = useGetMenu({ id: rowId });
  const {
    nameVisible,
    environmentFieldDisabled,
    environmentsData,
    filterModules,
    modulesFieldDisabled,
    changeModule,
    modulesOptions,
  } = useForms();


  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    getValues,
    watch,
  } = useForm({
    resolver: yupResolver(menuSchema),
    defaultValues: data,
  });

  watch((formValues: FieldValues) => {
    const { modules, environment } = formValues;
    if (modules) {
      changeModule(modules);
    }

    if (environment) {
      filterModules(environment);
    }
  });

  useEffect(() => {
    if (getValues('environment')) {
      filterModules(data.environment);
    }

    if(getValues('modules')) {
      changeModule(data.modules);
    }
  }, []);

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
    <Scrollbar>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={2}
              >
                <Typography variant="h4" gutterBottom>{t(`managements.menu.${data ? 'edit' : 'create'}`)}</Typography>
              </Stack>
              <ControlledAutocomplete
                defaultValue={data?.environment}
                errors={errors}
                name="environment"
                label={t('managements.environments.name')}
                control={control}
                options={environmentsData?.environmentsRestful || []}
                key="environments-autocomplete"
                optionLabel={(environmentValue: Options) => {
                  if (environmentValue) {
                    return environmentValue?.name;
                  }
                  return null;
                }}
                valueSerializer={(environmentValue: Options) => {
                  if (environmentValue) {
                    const { name, id } = environmentValue;
                    return {
                      name,
                      id,
                    };
                  }
                  return null;
                }}
                disabled={environmentFieldDisabled}
              />
              <ControlledAutocomplete
                defaultValue={data?.modules}
                multiple
                errors={errors}
                name="modules"
                label={t('managements.modules.list')}
                control={control}
                options={modulesOptions.filter((m) => !m.toolbox)}
                key="modules-autocomplete"
                optionLabel={(actionValue: Options) => {
                  if (actionValue) {
                    return actionValue?.name;
                  }
                  return null;
                }}
                isOptionEqualToValue={
                  (option: Options, value: Options) => option.id === value.id
                }
                valueSerializer={(actionValue: Options[]) => actionValue}
                disabled={modulesFieldDisabled}
              />
              {
                nameVisible && (
                  <ControlledTextField
                    errors={errors}
                    fieldName="name"
                    inputType="text"
                    label={t('managements.menu.name')}
                    register={register}
                    key="name-field"
                  />
                )
              }
              {
                data && (
                  <ControlledTextField
                    errors={errors}
                    fieldName="order"
                    inputType="number"
                    label={t('managements.menu.order')}
                    register={register}
                    key="order-field"
                  />
                )
              }
              <ControlledTextField
                errors={errors}
                fieldName="icon"
                inputType="text"
                label={t('managements.menu.icon')}
                register={register}
                key="icon-field"
              />
              <Button type="submit" variant="contained" loading={isSubmitting}>Submit</Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Scrollbar>
  </form>
  );
}
