import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import _ from 'lodash';
import {
  Stack,
  Tabs,
  Tab,
} from '@mui/material';
import ButtonLoading from '@mui/lab/LoadingButton';
import { ControlledAutocomplete, ControlledTextField } from '@gsuite/shared/ui';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, FieldValues } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { CLIENT_ROLE } from '@gsuite/shared/utils/constants';
import UploadFile from '@gsuite/ui/UploadFile';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { UseUpdateUser } from './api/updateUser';
import ConfirmCustomerUser from './components/ConfirmCustomerUser';
import Modules, { Module } from './components/Modules2';
import Notifications, { Notification } from './components/Notifications';
import { useRole } from '../roles/api/getRole';
import { useFindCompany } from '../../services/findCompany';
import { uploadFiles } from '../../services/uploadFiles';
import { useCreateUser } from './api/createUser';
import { useGetUser } from './api/getUser';

export type AutoComplete = {
  _id: string;
  number?: string;
  rfc: string;
  name: string;
};

type Props = {
  onClose: () => void;
  userId: string;
  mode?: 'create' | 'edit';
  companiesSelected?: AutoComplete[];
};

const CHARACTER_QUANTITY = 'managements.charactersQuantity';

export default function CreateCustomerUser({
  onClose,
  userId,
  mode = 'create',
  companiesSelected = [],
}: Props) {
  const { mutateAsync: updateUser } = UseUpdateUser({ userId });
  const { t } = useTranslation();
  const { errorMessage, successMessage } = useSnackNotification();
  const { debouncedCompany, data } = useFindCompany();
  const { data: user } = useGetUser({ id: userId });
  const { mutateAsync } = useCreateUser();
  const { data: customerRole } = useRole({ id: CLIENT_ROLE });
  const [, setModulesHaveBeenOverrided] = useState(false);
  const [notificationsHaveBeenOverrided, setNotificationsHaveBeenOverrided] = useState(false);
  const [tempModules, setTempModules] = useState<Module[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [tempNotifications, setTempNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const errMessage = t('generic.requiredField');
  const schema = Yup.object({
    photoUrl: Yup.string().optional(),
    name: Yup.string()
      .max(128, t(CHARACTER_QUANTITY, { value: 128 }))
      .required(errMessage)
      .matches(/^[a-zA-Z0-9\s]+$/, t('managements.no_special_characters')),
    lastName: Yup.string()
      .max(128, t(CHARACTER_QUANTITY, { value: 128 }))
      .required(errMessage)
      .matches(/^[a-zA-Z0-9\s]+$/, t('managements.no_special_characters')),
    emailAddress: Yup.string()
      .required(errMessage)
      .typeError(errMessage)
      .email(t('managements.invalid_email')),
    phoneNumber: Yup.string()
      .typeError(errMessage)
      .required(errMessage)
      .max(15, t(CHARACTER_QUANTITY, { value: 15 })),
    birthDate: Yup.string().optional(),
    companyRole: Yup.string().optional().max(64, t(CHARACTER_QUANTITY, { value: 64 })),
    companyDeparment: Yup.string().optional().max(64, t(CHARACTER_QUANTITY, { value: 64 })),
    companies: Yup.array().of(Yup.string()).min(1, t('managements.select_option')).required(errMessage),
  });

  const {
    handleSubmit,
    control,
    register,
    setValue,
    getValues,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>({
    resolver: yupResolver(schema) as any,
  });

  useEffect(() => {
    if (user) {
      const {
        name,
        lastName,
        emailAddress,
        phoneNumber,
        photoUrl,
        birthDate,
        companyRole,
        companyDeparment,
        companies: userCompanies,
      } = user;
      reset(
        {
          name,
          lastName,
          emailAddress,
          phoneNumber,
          ...(photoUrl && { photoUrl }),
          ...(birthDate && { birthDate: dayjs(birthDate).format('YYYY-MM-DD').toString() }),
          companyRole,
          companyDeparment,
          companies: userCompanies.map(({ _id: id }: AutoComplete) => id),
          wpNotifications: user.wpNotifications,
          emailNotifications: user.emailNotifications,
        },
      );
      setTempModules(
        user.overridedModules
        ?? customerRole?.modules
        ?? [],
      );
      setTempNotifications(
        user.overridedNotifications
        ?? customerRole?.notifications?.notifications
        ?? [],
      );
    }
  }, [user]);

  useEffect(() => {
    if (customerRole && mode === 'create') {
      setTempModules(customerRole?.modules ?? []);
      setTempNotifications(customerRole?.notifications?.notifications ?? []);
    }
    if (companiesSelected.length > 0) {
      setValue('companies', companiesSelected.map(({ _id }) => _id));
    }
  }, [customerRole]);

  const closeConfirm = () => setOpenConfirm(false);

  const onSubmit = async (dataForm: FieldValues) => {
    const overridedNotifications = tempNotifications.map((x) => ({
      name: x.name,
      permissions: x.permissions,
    }));

    const overridedModules = tempModules.map((x) => ({
      name: x.name,
      permissions: x.permissions,
    }));

    const newUser = {
      ...dataForm,
      overridedNotifications,
      overridedModules,
      roleId: customerRole?.id,
    };

    if (mode === 'edit') {
      const currentEnvirontments = _.get(user, 'environments', []);

      await updateUser({
        data: {
          ...newUser,
          ...(currentEnvirontments.length > 0 && {
            environments: currentEnvirontments,
          }),
        },
        userId,
      }).catch(() => {});
    } else {
      await mutateAsync({ data: newUser }).catch(() => {});
    }

    reset();
    closeConfirm();
    return onClose();
  };

  const openConfirmDialog = () => {
    if (mode === 'edit') {
      handleSubmit(onSubmit)();
    } else {
      trigger().then((isValid) => {
        if (isValid) {
          setOpenConfirm(true);
        } else {
          handleSubmit(onSubmit)();
        }
      });
    }
  };

  const handleChange = (
    _event: React.ChangeEvent<unknown>,
    newTabValue: number,
  ) => setActiveTab(newTabValue);

  const handleUpload = async (image: Buffer) => {
    try {
      const [result] = await uploadFiles(image, true);
      const { url } = result;
      setValue('photoUrl', url);
      successMessage(t('managements.image_upload'));
    } catch (error) {
      errorMessage(t('managements.image_upload_error'));
    }
  };
  const handleNotificationsChange = (
    newNotifications: Notification[],
  ) => setTempNotifications(newNotifications);

  const handleChangeNotificationsHaveBeenOverrided = (
    value: boolean,
  ) => setNotificationsHaveBeenOverrided(value);

  const handleChangeModulesHaveBeenOverrided = (
    value: boolean,
  ) => setModulesHaveBeenOverrided(value);
  const handleModulesChange = (newModules: Module[]) => setTempModules(newModules);
  const customOnChange = (value?: string) => {
    debouncedCompany(value);
  };

  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      alignItems="space-between"
      spacing={2}
      sx={{ p: 2 }}
    >
      <form autoComplete="off">
        <ControlledAutocomplete
          defaultValue={companiesSelected}
          customOnChange={customOnChange}
          multiple
          errors={errors}
          name="companies"
          label={`${t('managements.companies')} *`}
          control={control}
          options={data?.companiesFind ?? []}
          key="modules-autocomplete"
          optionLabel={(actionValue: AutoComplete) => {
            if (actionValue) {
              const name = actionValue.name ?? '';
              const number = actionValue.number ?? '';
              const rfc = actionValue.rfc ?? '';
              return `${number} - ${name} - ${rfc}`;
            }
            return null;
          }}
          isOptionEqualToValue={
            (
              { _id: optionId }: AutoComplete,
              { _id: valueId }: AutoComplete,
            ) => optionId === valueId
          }
          valueSerializer={(actionValue: AutoComplete[]) => {
            const values = actionValue.map(({ _id: id }) => id);
            const names = actionValue.map(({ name }) => name);
            setCompanies(names);
            return values;
          }}
          disabled={false}
        />
        <Tabs
          value={activeTab}
          indicatorColor="primary"
          onChange={handleChange}
          sx={{ mt: 2 }}
        >
          <Tab
            sx={{ px: 1 }}
            label={t('managements.usersModule.generalInfo')}
            key={1}
            value={0}
          />
          <Tab
            sx={{ px: 1 }}
            label={t('managements.usersModule.modulesAndPermissions')}
            key={2}
            value={1}
          />
          <Tab
            sx={{ px: 1 }}
            label={t('managements.usersModule.notifications')}
            key={3}
            value={2}
          />
        </Tabs>
        {activeTab === 0 && (
          <Stack spacing={2} sx={{ mt: 5 }} alignItems="center">
            <UploadFile
              handleUpload={handleUpload}
              defaultImage={getValues('photoUrl')}
              setValue={setValue}
            />
            <ControlledTextField
              errors={errors}
              fieldName="name"
              inputType="text"
              label={`${t('managements.name')}*`}
              register={register}
              key="name-field"
            />
            <ControlledTextField
              errors={errors}
              fieldName="lastName"
              inputType="text"
              label={`${t('managements.lastName')} *`}
              register={register}
              key="lastName-field"
            />
            <ControlledTextField
              errors={errors}
              fieldName="phoneNumber"
              inputType="number"
              label={`${t('managements.phoneNumber')}*`}
              register={register}
              key="phoneNumber-field"
            />
            <ControlledTextField
              errors={errors}
              fieldName="emailAddress"
              inputType="text"
              label={`${t('managements.emailAddress')}*`}
              register={register}
              key="emailAddress-field"
            />
            <ControlledTextField
              label={t('managements.birthDate')}
              register={register}
              inputType="date"
              errors={errors}
              fieldName="birthDate"
              key="date-field"
            />
            <ControlledTextField
              errors={errors}
              fieldName="companyDeparment"
              inputType="text"
              label={t('managements.department')}
              register={register}
              key="companyDeparment-field"
            />
            <ControlledTextField
              errors={errors}
              fieldName="companyRole"
              inputType="text"
              label={t('managements.job')}
              register={register}
              key="companyRole-field"
            />
          </Stack>
        )}
        {activeTab === 1 && (
          <Modules
            availableRoles={[customerRole ?? {}]}
            selectedRole={customerRole}
            onModulesHaveBeenOverridedChange={handleChangeModulesHaveBeenOverrided}
            userModules={tempModules}
            onModulesChange={handleModulesChange}
            viewRole={false}
            isEdit={mode === 'edit'}
          />
        )}
        {activeTab === 2 && (
          <>
            <Notifications
              availableRoles={[customerRole ?? {}]}
              selectedRole={customerRole}
              control={control}
              userNotifications={tempNotifications}
              onNotificationsChange={handleNotificationsChange}
              onOverridedNotificationsChange={handleChangeNotificationsHaveBeenOverrided}
              setValue={setValue}
              overridedNotifications={notificationsHaveBeenOverrided}
              viewRole={false}
              isEdit={mode === 'edit'}
            />
            <Stack
              direction="row"
              spacing={2}
            >
              <ButtonLoading
                sx={{ width: '100%' }}
                variant="contained"
                onClick={onClose}
                color="error"
                type="button"
              >
                {t('generic.cancel')}
              </ButtonLoading>
              <ButtonLoading
                sx={{ width: '100%' }}
                variant="contained"
                type="button"
                onClick={openConfirmDialog}
                color="primary"
                loading={isSubmitting}
              >
                {t('generic.save')}
              </ButtonLoading>
            </Stack>
          </>
        )}
        <ConfirmCustomerUser
          open={openConfirm}
          handleClose={closeConfirm}
          handleConfirm={handleSubmit(onSubmit)}
          userName={`${getValues('name')} ${getValues('lastName')}`}
          companies={companies}
          email={getValues('emailAddress')}
        />
      </form>
    </Stack>
  );
}
