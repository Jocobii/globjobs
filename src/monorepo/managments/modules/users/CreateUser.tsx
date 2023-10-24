import { SetStateAction, useState } from 'react';
import {
  Stack, Tabs, Tab,
} from '@mui/material';
import * as Yup from 'yup';
import Button from '@mui/lab/LoadingButton';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm, FieldValues } from 'react-hook-form';

import { useSnackNotification } from '@gsuite/shared/hooks';
import GeneralInfo, {
  formSchema as generalInfoSchema,
} from './components/GeneralInfo';
import Modules, { Module } from './components/Modules2';
import Notifications, { Notification, formSchema as notificationsSchema } from './components/Notifications';
import { useRestfulHeadquarters } from '../headquarters/api/restful';
import { useRestfulDepartments } from '../departments/api/restful';
import { useRestfulEnvironments } from '../modules/api/getEnvironments';
import { useRestfulAreas } from '../areas/api/restful';
import { useRestfulRoles } from '../roles/api/restful';
import { useCreateUser } from './api/createUser';

type Props = {
  onClose: () => void;
};

export default function Create({ onClose }: Props) {
  const [activeTab, setActiveTab] = useState(0);
  const { data: headuartersData } = useRestfulHeadquarters();
  const { data: departmentsData } = useRestfulDepartments();
  const { data: environmentsData } = useRestfulEnvironments();
  const { data: areasData } = useRestfulAreas();
  const { data: rolesData } = useRestfulRoles();
  const [userHeadquarter, setUserHeadquarter] = useState();
  const [userDepartment, setUserDepartment] = useState();
  const [userArea, setUserArea] = useState();
  const [tempModules, setTempModules] = useState<Module[]>([]);
  const [tempNotifications, setTempNotifications] = useState<Notification[]>([]);
  const { t } = useTranslation();
  const [modulesHaveBeenOverrided, setModulesHaveBeenOverrided] = useState(false);
  const [notificationsHaveBeenOverrided, setNotificationsHaveBeenOverrided] = useState(false);
  const [generalInfoIsValid, setGeneralInfoIsValid] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>();
  const { errorMessage } = useSnackNotification();
  const { mutateAsync } = useCreateUser();

  const schema = Yup.object({
    ...generalInfoSchema(t).fields,
    ...notificationsSchema.fields,
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<FieldValues>({
    resolver: yupResolver(schema),
  });

  watch((formValues: FieldValues) => {
    const { department, headquarter, area } = formValues;
    setUserDepartment(department);
    setUserHeadquarter(headquarter);
    setUserArea(area);
  });

  watch((formValues: FieldValues) => {
    generalInfoSchema(t)
      .isValid(formValues)
      .then((res) => setGeneralInfoIsValid(res));
  });

  const handleChangeSelectedRole = (value: any) => {
    setModulesHaveBeenOverrided(false);
    setNotificationsHaveBeenOverrided(false);
    setTempModules([]); // Empty the overrided modules
    setTempNotifications([]); // Empty the overrided notifications
    if (rolesData?.rolesRestful && rolesData?.rolesRestful.length > 0) {
      const targetRole = rolesData?.rolesRestful.find((x) => x.id === value);
      setSelectedRole(targetRole as SetStateAction<undefined>);
    }
  };

  const onSubmit: SubmitHandler<any> = async (data) => {
    const newUser = {
      ...data,
      ...(notificationsHaveBeenOverrided && {
        overridedNotifications: tempNotifications.map((x) => ({
          name: x.name,
          permissions: x.permissions,
        })),
      }),
      ...(modulesHaveBeenOverrided && {
        overridedModules: tempModules.filter((m) => m.checked).map((x) => ({
          name: x.name,
          permissions: x.permissions,
        })),
      }),
      roleId: selectedRole?.id,
    };

    if (!selectedRole?.id) {
      return errorMessage(t<string>('managements.usersModule.roleRequired'));
    }

    await mutateAsync({ data: newUser });
    reset();
    return onClose();
  };

  const handleModulesChange = (newModules: Module[]) => setTempModules(newModules);

  const handleNotificationsChange = (
    newNotifications: Notification[],
  ) => setTempNotifications(newNotifications);

  const handleChangeModulesHaveBeenOverrided = (
    value: boolean,
  ) => setModulesHaveBeenOverrided(value);

  const handleChangeNotificationsHaveBeenOverrided = (
    value: boolean,
  ) => setNotificationsHaveBeenOverrided(value);

  const oneModuleChecked = tempModules?.some((x) => x.checked);
  const checkedModuleOnRole = selectedRole?.modules?.some(
    (m: { permissions: Array<{ checked: boolean }> }) => m?.permissions?.some((p) => p?.checked),
  );

  let canRenderNextButton = activeTab < 2 && generalInfoIsValid;
  if (
    activeTab === 1
    && (!selectedRole || (!oneModuleChecked && !checkedModuleOnRole))
  ) {
    canRenderNextButton = false;
  }

  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      spacing={2}
      sx={{ p: 2 }}
    >
      <Tabs value={activeTab} indicatorColor="primary">
        <Tab
          sx={{ px: 1 }}
          label={t<string>('managements.usersModule.generalInfo')}
          key={1}
        />
        <Tab
          sx={{ px: 1 }}
          label={t<string>('managements.usersModule.modulesAndPermissions')}
          key={2}
        />
        <Tab
          sx={{ px: 1 }}
          label={t<string>('managements.usersModule.notifications')}
          key={3}
        />
      </Tabs>
      <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
        {activeTab === 0 && (
        <GeneralInfo
          environments={[]}
          userArea={userArea}
          userDepartment={userDepartment}
          userHeadquarter={userHeadquarter}
          areasData={areasData}
          control={control}
          departmentsData={departmentsData}
          headquartersData={headuartersData}
          environmentsData={environmentsData}
          errors={errors}
          register={register}
          t={t}
        />
        )}
        {activeTab === 1 && (
          <Modules
            onModulesHaveBeenOverridedChange={handleChangeModulesHaveBeenOverrided}
            onRoleChange={handleChangeSelectedRole}
            selectedRole={selectedRole}
            availableRoles={rolesData?.rolesRestful || []}
            userModules={tempModules}
            onModulesChange={handleModulesChange}
          />
        )}
        {activeTab === 2 && (
          <Notifications
            availableRoles={rolesData?.rolesRestful || []}
            selectedRole={selectedRole}
            onSelectedRoleChange={handleChangeSelectedRole}
            control={control}
            userNotifications={tempNotifications}
            onNotificationsChange={handleNotificationsChange}
            onOverridedNotificationsChange={handleChangeNotificationsHaveBeenOverrided}
            setValue={setValue}
            overridedNotifications={notificationsHaveBeenOverrided}
          />
        )}
        <Stack direction="row" spacing={2}>
          {activeTab > 0 && (
          <Button
            sx={{ width: '100%' }}
            variant="outlined"
            onClick={() => setActiveTab((prev) => prev - 1)}
          >
            {t<string>('prev')}
          </Button>
          )}
          {canRenderNextButton && (
          <Button
            sx={{ width: '100%' }}
            variant="contained"
            onClick={() => setActiveTab((prev) => prev + 1)}
          >
            {t<string>('next')}
          </Button>
          )}
          {activeTab === 2 && (
          <Button
            sx={{ width: '100%' }}
            variant="contained"
            type="submit"
            loading={isSubmitting}
          >
            {t<string>('generic.save')}
          </Button>
          )}
        </Stack>
      </form>
    </Stack>
  );
}
