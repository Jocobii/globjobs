import { useState } from 'react';
import {
  Grid,
  Card,
  Stack,
  Typography,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import Button from '@mui/lab/LoadingButton';
import type { FieldErrors, UseFormRegister, Control } from 'react-hook-form';
import { FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import {
  Scrollbar, ControlledTextField, ControlledAutocomplete, ControlledSelect,
} from '../../../../components';
import { useRestfulHeadquarters } from '../../headquarters/api/restful';
import { useRestfulDepartments } from '../../departments/api/restful';
import { useRestfulAreas } from '../../areas/api/restful';

type Props = {
  isSubmitting?: boolean;
  handleSubmit: any;
  register: UseFormRegister<FieldValues>;
  control: Control<FieldValues>;
  errors: FieldErrors;
  data: any;
  onSubmitToggleActiveUser: () => void;
};

type AutoComplete = {
  id: string;
  name: string;
};

const employeeTypes = ['Directo', 'Indirecto'];

export default function UpdateForm({
  isSubmitting = false,
  handleSubmit,
  register,
  control,
  errors,
  data,
  onSubmitToggleActiveUser,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const { data: headquartersData } = useRestfulHeadquarters();
  const { data: areasData } = useRestfulAreas();
  const { data: departmentsData } = useRestfulDepartments();

  const label = data?.active ? t('managements.deactivate') : t('managements.activate');

  const toggleOpenActivateUserDialog = () => setIsOpen((prev) => !prev);

  const handleSubmitToggleActiveUser = () => {
    onSubmitToggleActiveUser();
    toggleOpenActivateUserDialog();
  };

  return (
    <>
      <Dialog open={isOpen} onClose={toggleOpenActivateUserDialog}>
        <DialogTitle>{label}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {
              data?.active
                ? t('managements.deactivateMessage', { name: `${data?.name} ${data?.lastName}` })
                : t('managements.activateMessage', { name: `${data?.name} ${data?.lastName}` })
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleOpenActivateUserDialog}>{t('cancel')}</Button>
          <Button variant="contained" onClick={handleSubmitToggleActiveUser}>{label}</Button>
        </DialogActions>
      </Dialog>
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
                    <Typography variant="h4" gutterBottom>{t('managements.updateUser')}</Typography>
                    <Button
                      variant="contained"
                      onClick={toggleOpenActivateUserDialog}
                    >
                      {label}
                    </Button>
                  </Stack>
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
                    label={t('managements.emailAddress')}
                    register={register}
                    key="emailAddress-field"
                    disabled
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
                    defaultValue={data?.headquarter}
                    errors={errors}
                    name="headquarter"
                    label={t('managements.site')}
                    control={control}
                    options={headquartersData?.headquartersRestful || []}
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
                    defaultValue={data?.area}
                    errors={errors}
                    name="area"
                    label={t('managements.area')}
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
                    defaultValue={data?.department}
                    errors={errors}
                    name="department"
                    label={t('managements.department')}
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
    </>
  );
}
