/* eslint-disable react/jsx-props-no-spreading */
import {
  Grid,
  Card,
  Stack,
  Typography,
} from '@mui/material';
import { t } from 'i18next';
import Button from '@mui/lab/LoadingButton';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Scrollbar from '@gsuite/ui/Scrollbar';
import { ControlledTextField, ControlledAutocomplete, ControlledCheckbox } from '@gsuite/shared/ui';
import { capitalizeFirstLetter } from '@gsuite/shared/utils/format';
import { useRestfulEnvironments } from '../api/getEnvironments';

import { Module,  moduleSchema, Options } from '../types';

type Props = {
  initialValues?: Module;
  moduleId?: string;
  onSubmit: (data: Module) => void;
};

export default function Form({
  initialValues,
  moduleId,
  onSubmit,
}: Props) {
  const { data: environmentsData } = useRestfulEnvironments();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(moduleSchema),
    defaultValues: initialValues,
  });
  const isUpdate = moduleId && moduleId !== 'create';

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
                  <Typography variant="h4" gutterBottom>{t(`managements.modules.${isUpdate ? 'edit' : 'create'}`)}</Typography>
                </Stack>
                <ControlledTextField
                  errors={errors}
                  fieldName="name"
                  inputType="text"
                  label={t('managements.modules.name')}
                  register={register}
                  key="name-field"
                />
                <ControlledTextField
                  errors={errors}
                  fieldName="description"
                  inputType="text"
                  label={t('managements.modules.description')}
                  register={register}
                  key="description-field"
                />
                <ControlledTextField
                  errors={errors}
                  fieldName="route"
                  inputType="text"
                  label={t('managements.modules.route')}
                  register={register}
                  key="route-field"
                />
                <ControlledTextField
                  errors={errors}
                  fieldName="component"
                  inputType="text"
                  label={t('managements.modules.component')}
                  register={register}
                  key="component-field"
                />
                <ControlledTextField
                  errors={errors}
                  fieldName="icon"
                  inputType="text"
                  label={t('managements.modules.icon')}
                  register={register}
                  key="icon-field"
                />
                <ControlledCheckbox
                  name="exact"
                  label={t('managements.modules.exact')}
                  control={control}
                />
                <ControlledCheckbox
                  name="toolbox"
                  label={t('managements.modules.toolbox')}
                  control={control}
                />
                <ControlledAutocomplete
                  defaultValue={initialValues?.environment}
                  errors={errors}
                  name="environment"
                  label={t('managements.environments.name')}
                  control={control}
                  options={environmentsData?.environmentsRestful ?? []}
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
                />
                <ControlledAutocomplete
                  defaultValue={initialValues?.actions}
                  multiple
                  errors={errors}
                  name="actions"
                  label={t('managements.modules.actions')}
                  control={control}
                  options={
                    ['create', 'read', 'update', 'report', 'delete']
                      .map((action) => ({
                        id: action,
                        name: capitalizeFirstLetter(action),
                      }))
                    }
                  isOptionEqualToValue={
                    (option: Options, value: Options) => option.id === value.id
                  }
                  freeSolo
                  key="actions-autocomplete"
                  optionLabel={(actionValue: Options) => {
                    if (actionValue) {
                      return (
                        typeof actionValue === 'string'
                          ? actionValue
                          : actionValue?.name
                      );
                    }
                    return null;
                  }}
                  valueSerializer={(actionValue: Options[]) => actionValue.map((value) => {
                    if (typeof value === 'string') {
                      return {
                        id: value, name: value,
                      };
                    }
                    return value;
                  })}
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
