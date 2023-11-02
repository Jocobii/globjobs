import {
  Grid,
  Stack,
  MenuItem,
  Card,
} from '@mui/material';
import * as Yup from 'yup';
import { FieldValues } from 'react-hook-form';
import type { FieldErrors, UseFormRegister, Control } from 'react-hook-form';
import { capitalizeFirstLetter } from '@gsuite/shared/utils/format';
import { TFunctionType } from '@gsuite/typings/common';
import {
  ControlledTextField,
  ControlledAutocomplete,
  ControlledSelect,
} from '@gsuite/shared/ui';

import { RestfulHeadquartersResponse } from '../../headquarters/api/restful';
import { RestfulDepartmentsResponse } from '@/pages/managments/departments/api/restful';
import { RestfulAreasResponse } from '@/pages/managments/areas/api/restful';
import { RestfulEnvironmentsResponse } from '../../modules/api/getEnvironments';

export const formSchema = (t: TFunctionType) => {
  const errMessage = t('generic.requiredField');
  return Yup.object().shape({
    name: Yup.string().required(errMessage),
    lastName: Yup.string().required(errMessage),
    emailAddress: Yup.string().required(errMessage).typeError(errMessage),
    employeeNumber: Yup.string().required(errMessage),
    birthDate: Yup.string().required(errMessage),
    phoneNumber: Yup.string().required(errMessage),
    headquarter: Yup.object({}).required(errMessage),
    department: Yup.object({}).required(errMessage),
    environments: Yup.array().of(
      Yup.object().shape({
        id: Yup.string(),
        name: Yup.string(),
      }),
    ).nullable(),
    area: Yup.object({}).required(errMessage),
    coach: Yup.string().required(errMessage),
    charge: Yup.string().required(errMessage),
    employeeType: Yup.string().required(errMessage),
    costCenter: Yup.string().required(errMessage),
    darwinUser: Yup.string().required(errMessage),
    rbSystemsUser: Yup.string().required(errMessage),
  });
};

type AutoComplete = {
  id: string;
  name: string;
};

type Props = {
  userArea: any;
  userDepartment: any;
  userHeadquarter: any;
  environments: any;
  register: UseFormRegister<FieldValues>;
  control: Control<FieldValues>;
  errors: FieldErrors;
  t: TFunctionType;
  headquartersData: RestfulHeadquartersResponse | undefined;
  departmentsData: RestfulDepartmentsResponse | undefined;
  areasData: RestfulAreasResponse | undefined;
  environmentsData: RestfulEnvironmentsResponse | undefined,
  userId?: string,
};

const employeeTypes = ['Directo', 'Indirecto'];

export default function GeneralInfo({
  userHeadquarter,
  userArea,
  userDepartment,
  register,
  errors,
  control,
  headquartersData,
  departmentsData,
  areasData,
  t,
  userId = undefined,
  environmentsData,
  environments,
}: Props) {
  const editMode = !!userId;
  // const {
  //   data: validEmail,
  //   debouncedValidation,
  // } = useGenerateEmailAddress();
  // const {
  //   debouncedValidation: isValidDebounce,
  //   data: isValid,
  //   loading,
  // } = useValidateEmailAddress();

  // watch((formValues: FieldValues) => {
  //   const { name, lastName, emailAddress } = formValues;
  //   if (name && lastName) debouncedValidation(name, lastName);
  //   if (emailAddress) isValidDebounce(emailAddress);
  // });

  // let inputAddornment = null;
  // if (loading) {
  //   inputAddornment = (
  //     <CachedIcon
  //       sx={{
  //         animation: 'spin 2s linear infinite',
  //         '@keyframes spin': {
  //           '0%': {
  //             transform: 'rotate(360deg)',
  //           },
  //           '100%': {
  //             transform: 'rotate(0deg)',
  //           },
  //         },
  //       }}
  //     />
  //   );
  // }

  // if (!loading && getValues('emailAddress') !== '' && isValid?.verifyEmail.isValid === false) {
  //   inputAddornment = (
  //     <Tooltip title="Email is not valid" placement="right">
  //       <ErrorIcon sx={{ color: theme.palette.error.main }} />
  //     </Tooltip>
  //   );
  // }

  // if (!loading && isValid?.verifyEmail.isValid === true && getValues('emailAddress') !== '') {
  //   inputAddornment = <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
  // }

  // useEffect(() => {
  //   setValue('emailAddress', validEmail?.generateValidEmail.validEmail ?? null);
  // }, [setValue, validEmail?.generateValidEmail]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card sx={{ py: 3, boxShadow: 'none' }}>
          <Stack spacing={3}>
            <ControlledTextField
              errors={errors}
              fieldName="name"
              inputType="text"
              label={t('managements.name')}
              register={register}
              key="name-field"
            />
            <ControlledTextField
              errors={errors}
              fieldName="lastName"
              inputType="text"
              label={t('managements.lastName')}
              register={register}
              key="lastName-field"
            />
            <ControlledTextField
              errors={errors}
              fieldName="employeeNumber"
              inputType="text"
              label={t('managements.employeeNumber')}
              register={register}
              key="employeeNumber-field"
            />
            <ControlledTextField
              errors={errors}
              fieldName="emailAddress"
              inputType="text"
              disabled={editMode}
              label={t('managements.emailAddress')}
              register={register}
              key="emailAddress-field"
              // endAdornment={inputAddornment}
            />
            <ControlledTextField
              errors={errors}
              fieldName="phoneNumber"
              inputType="text"
              label={t('managements.phoneNumber')}
              register={register}
              key="phoneNumber-field"
            />
            <ControlledTextField
              errors={errors}
              fieldName="birthDate"
              inputType="date"
              label={t('managements.birthDate')}
              register={register}
              registerOptions={{ valueAsDate: false }}
              key="birthDate-field"
            />
            <ControlledTextField
              errors={errors}
              fieldName="charge"
              inputType="text"
              label={t('managements.charge')}
              register={register}
              key="charge-field"
            />
            <ControlledSelect
              label={t('managements.employeeType')}
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
              label={t('managements.coach')}
              register={register}
              key="coach-field"
            />
            <ControlledTextField
              errors={errors}
              fieldName="costCenter"
              inputType="text"
              label={t('managements.costsCenter')}
              register={register}
              key="costCenter-field"
            />
            <ControlledTextField
              errors={errors}
              fieldName="darwinUser"
              inputType="text"
              label={t('managements.darwinUser')}
              register={register}
              key="darwinUser-field"
            />
            <ControlledTextField
              errors={errors}
              fieldName="rbSystemsUser"
              inputType="text"
              label={t('managements.rbSystemsUser')}
              register={register}
              key="rbSystemsUser-field"
            />
            <ControlledAutocomplete
              errors={errors}
              name="headquarter"
              defaultValue={userHeadquarter}
              label={t('managements.site')}
              control={control}
              options={headquartersData?.headquartersRestful ?? []}
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
              label={t('managements.area')}
              control={control}
              defaultValue={userArea}
              options={areasData?.areaRestful ?? []}
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
              defaultValue={userDepartment}
              name="department"
              label={t('managements.department')}
              control={control}
              options={departmentsData?.departmentsRestful ?? []}
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
            <ControlledAutocomplete
              errors={errors}
              multiple
              defaultValue={environments}
              name="environments"
              label="Ambientes"
              control={control}
              options={environmentsData?.environmentsRestful.map(({ name, id }) => ({
                id: id ?? '',
                name: capitalizeFirstLetter(name ?? ''),
              })) ?? []}
              key="environment-autocomplete"
              isOptionEqualToValue={
                (option: AutoComplete, value: AutoComplete) => option.id === value.id
              }
              freeSolo
              optionLabel={(envValue: AutoComplete) => {
                if (envValue) {
                  return envValue?.name;
                }
                return null;
              }}
              valueSerializer={(envValue: AutoComplete[]) => {
                if (envValue) {
                  return envValue.map((e) => ({ id: e.id, name: e.name }));
                }
                return {};
              }}
            />
            {/* Aqui iba el button para el submit */}
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
