import { useEffect } from 'react';
import {
  Grid,
  Card,
  Stack,
  Typography,
  MenuItem,
  Tooltip,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Button from '@mui/lab/LoadingButton';
import CachedIcon from '@mui/icons-material/Cached';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { FieldErrors, UseFormRegister, Control } from 'react-hook-form/dist/types';
import { FieldValues } from 'react-hook-form';

import Scrollbar from '@gsuite/ui/Scrollbar';
import { ControlledTextField, ControlledAutocomplete, ControlledSelect } from '@gsuite/shared/ui';
import { useRestfulHeadquarters } from '../../headquarters/api/restful';
import { useRestfulDepartments } from '../../departments/api/restful';
import { useRestfulAreas } from '../../areas/api/restful';
import { useGenerateEmailAddress } from '../../../services/generateEmailAddress';
import { useValidateEmailAddress } from '../../../services/isValidEmail';

type Props = {
  handleSubmit: any;
  errors: FieldErrors;
  register: UseFormRegister<FieldValues>;
  control: Control<FieldValues>;
  isSubmitting?: boolean;
  getValues: (field: string) => any;
  setValue: (field: string, value: any) => void;
  watch: (formValues: FieldValues) => void;
};

type AutoComplete = {
  id: string;
  name: string;
};

const employeeTypes = ['Directo', 'Indirecto'];

export default function UsersForm({
  handleSubmit,
  errors,
  register,
  control,
  isSubmitting = false,
  getValues,
  watch,
  setValue,
}: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const { data: headuartersData } = useRestfulHeadquarters();
  const { data: areasData } = useRestfulAreas();
  const { data: departmentsData } = useRestfulDepartments();
  const {
    data: validEmail,
    debouncedValidation,
  } = useGenerateEmailAddress();
  const {
    debouncedValidation: isValidDebounce,
    data: isValid,
    loading,
  } = useValidateEmailAddress();

  watch((formValues: FieldValues) => {
    const { name, lastName, emailAddress } = formValues;
    debouncedValidation(name, lastName);
    if (emailAddress) {
      isValidDebounce(emailAddress);
    }
  });

  useEffect(() => {
    setValue('emailAddress', validEmail?.generateValidEmail.validEmail ?? null);
  }, [setValue, validEmail?.generateValidEmail]);

  let inputAddornment = null;
  if (loading) {
    inputAddornment = (
      <CachedIcon
        sx={{
          animation: 'spin 2s linear infinite',
          '@keyframes spin': {
            '0%': {
              transform: 'rotate(360deg)',
            },
            '100%': {
              transform: 'rotate(0deg)',
            },
          },
        }}
      />
    );
  }

  if (!loading && getValues('emailAddress') !== '' && isValid?.verifyEmail.isValid === false) {
    inputAddornment = (
      <Tooltip title="Email is not valid" placement="right">
        <ErrorIcon sx={{ color: theme.palette.error.main }} />
      </Tooltip>
    );
  }

  if (!loading && isValid?.verifyEmail.isValid === true && getValues('emailAddress') !== '') {
    inputAddornment = <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
  }

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
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
                  <Typography variant="h4" gutterBottom>{t<string>('managements.createUser')}</Typography>
                </Stack>
                <ControlledTextField
                  errors={errors}
                  fieldName="name"
                  inputType="text"
                  label={t<string>('managements.name')}
                  register={register}
                  key="name-field"
                />
                <ControlledTextField
                  errors={errors}
                  fieldName="lastName"
                  inputType="text"
                  label={t<string>('managements.lastName')}
                  register={register}
                  key="lastName-field"
                />
                <ControlledTextField
                  errors={errors}
                  fieldName="employeeNumber"
                  inputType="text"
                  label={t<string>('managements.employeeNumber')}
                  register={register}
                  key="employeeNumber-field"
                />
                <ControlledTextField
                  errors={errors}
                  fieldName="emailAddress"
                  inputType="text"
                  label={t<string>('managements.emailAddress')}
                  register={register}
                  key="emailAddress-field"
                  endAdornment={inputAddornment}
                />
                <ControlledTextField
                  errors={errors}
                  fieldName="phoneNumber"
                  inputType="text"
                  label={t<string>('managements.phoneNumber')}
                  register={register}
                  key="phoneNumber-field"
                />
                <ControlledTextField
                  errors={errors}
                  fieldName="birthDate"
                  inputType="date"
                  label={t<string>('managements.birthDate')}
                  register={register}
                  registerOptions={{ valueAsDate: false }}
                  key="birthDate-field"
                />
                <ControlledTextField
                  errors={errors}
                  fieldName="charge"
                  inputType="text"
                  label={t<string>('managements.charge')}
                  register={register}
                  key="charge-field"
                />
                <ControlledSelect
                  label={t<string>('managements.employeeType')}
                  control={control}
                  name="employeeType"
                  key="employeeType-select"
                  errors={errors}
                  defaultValue=""
                >
                  {employeeTypes.map((employeeType) => (
                    <MenuItem key={employeeType} value={employeeType}>
                      {employeeType}
                    </MenuItem>
                  ))}
                </ControlledSelect>
                <ControlledTextField
                  errors={errors}
                  fieldName="coach"
                  inputType="text"
                  label={t<string>('managements.coach')}
                  register={register}
                  key="coach-field"
                />
                <ControlledTextField
                  errors={errors}
                  fieldName="costCenter"
                  inputType="text"
                  label={t<string>('managements.costsCenter')}
                  register={register}
                  key="costCenter-field"
                />
                <ControlledTextField
                  errors={errors}
                  fieldName="darwinUser"
                  inputType="text"
                  label={t<string>('managements.darwinUser')}
                  register={register}
                  key="darwinUser-field"
                />
                <ControlledTextField
                  errors={errors}
                  fieldName="rbSystemsUser"
                  inputType="text"
                  label={t<string>('managements.rbSystemsUser')}
                  register={register}
                  key="rbSystemsUser-field"
                />
                <ControlledAutocomplete
                  errors={errors}
                  name="headquarter"
                  label={t<string>('managements.site')}
                  control={control}
                  options={headuartersData?.headquartersRestful || []}
                  key="headquarters-autocomplete"
                  optionLabel={(headquarterValue: AutoComplete) => {
                    if (headquarterValue) {
                      return headquarterValue?.name;
                    }
                    return null;
                  }}
                  valueSerializer={(headquarterValue: AutoComplete) => {
                    if (headquarterValue) {
                      const { name, id } = headquarterValue;
                      return {
                        name,
                        id,
                      };
                    }
                    return null;
                  }}
                />
                <ControlledAutocomplete
                  errors={errors}
                  name="area"
                  label={t<string>('managements.area')}
                  control={control}
                  options={areasData?.areaRestful || []}
                  key="areas-autocomplete"
                  optionLabel={(areaValue: AutoComplete) => {
                    if (areaValue) {
                      return areaValue?.name;
                    }
                    return null;
                  }}
                  valueSerializer={(areaValue: AutoComplete) => {
                    if (areaValue) {
                      const { name, id } = areaValue;
                      return {
                        name,
                        id,
                      };
                    }
                    return null;
                  }}
                />
                <ControlledAutocomplete
                  errors={errors}
                  name="department"
                  label={t<string>('managements.department')}
                  control={control}
                  options={departmentsData?.departmentsRestful || []}
                  key="departments-autocomplete"
                  optionLabel={(departmentValue: AutoComplete) => {
                    if (departmentValue) {
                      return departmentValue?.name;
                    }
                    return null;
                  }}
                  valueSerializer={(departmentValue: AutoComplete) => {
                    if (departmentValue) {
                      const { name, id } = departmentValue;
                      return {
                        name,
                        id,
                      };
                    }
                    return null;
                  }}
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
