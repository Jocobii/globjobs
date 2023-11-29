import { SetStateAction, useState, useEffect } from 'react';
import {
  Drawer,
  Stack,
  Typography,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogActions,
  DialogContent,
} from '@mui/material';
import Button from '@mui/lab/LoadingButton';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { SubmitHandler, useForm, FieldValues } from 'react-hook-form';
import dayjs from 'dayjs';
import isBoolean from 'lodash/isBoolean';
import { useSnackNotification } from '../../../hooks';

import GeneralInfo, {
  formSchema as generalInfoSchema,
} from './components/GeneralInfo';
import Modules, { Module } from './components/Modules2';
import Notifications, { Notification, formSchema as notificationsSchema } from './components/Notifications';
import { useRestfulHeadquarters } from '../headquarters/api/restful';
import { useRestfulDepartments } from '../departments/api/restful';
import { useRestfulAreas } from '../areas/api/restful';
import { useRestfulRoles } from '../roles/api/restful';
import { useRestfulEnvironments } from '../modules/api/getEnvironments';
import { UseUpdateUser } from './api/updateUser';
import { useGetUser } from './api/getUser';
import { useToggleActiveUser } from './api/toggleActiveUser';

type Props = {
  open: boolean;
  onClose: () => void;
  userId: string;
};

export default function Update({ onClose, open, userId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { data: headuartersData } = useRestfulHeadquarters();
  const { data: environmentsData } = useRestfulEnvironments();
  const { data: departmentsData } = useRestfulDepartments();
  const { data: areasData } = useRestfulAreas();
  const { data: rolesData } = useRestfulRoles();
  const [userHeadquarter, setUserHeadquarter] = useState<any>();
  const [userDepartment, setUserDepartment] = useState<any>();
  const [userArea, setUserArea] = useState<any>();
  const [tempModules, setTempModules] = useState<Module[]>([]);
  const [tempNotifications, setTempNotifications] = useState<Notification[]>([]);
  const { t } = useTranslation();
  const [modulesHaveBeenOverrided, setModulesHaveBeenOverrided] = useState(false);
  const [notificationsHaveBeenOverrided, setNotificationsHaveBeenOverrided] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>();
  const { errorMessage } = useSnackNotification();
  const { mutateAsync } = UseUpdateUser({ userId });
  const userQuery = useGetUser({ id: userId });
  const { mutateAsync: mutateAsyncToggleActiveUser } = useToggleActiveUser({ userId });

  const label = userQuery?.data?.active ? t('managements.deactivate') : t('managements.activate');

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
    getValues,
  } = useForm<FieldValues>({
    resolver: yupResolver(schema) as any,
  });

  useEffect(() => {
    if (userQuery?.data?.role?.id) setSelectedRole(userQuery.data.role);
    if (userQuery?.data?.overridedModules?.length) {
      setModulesHaveBeenOverrided(true);
      const newInitialModules = userQuery?.data?.overridedModules?.map((m: any) => {
        const isActive = m.permissions.some((x: any) => x.checked);
        return {
          name: m.name,
          key: m.key,
          checked: isActive,
          permissions: m.permissions.map((x: any) => ({
            name: x.name,
            checked: x.checked,
          })),
        };
      });
      if (newInitialModules) {
        setTempModules(newInitialModules);
      }
    }
    if (userQuery?.data?.overridedNotifications?.length) {
      setNotificationsHaveBeenOverrided(true);
      const newInitialNotifications = userQuery?.data?.overridedNotifications?.map((n: any) => {
        const isActive = n.permissions?.some((x: any) => x.checked);
        return {
          name: n.name,
          checked: isActive,
          permissions: n.permissions?.map((x: any) => ({
            name: x.name,
            checked: x.checked,
          })),
        };
      });

      setTempNotifications(newInitialNotifications);
    }
  }, [userQuery.data]);

  useEffect(() => {
    if (userQuery.data) {
      const newData = userQuery.data;
      const initialValues = {
        ...newData,
        birthDate: newData?.birthDate ? String(dayjs(newData?.birthDate)?.format('YYYY-MM-DD')) : null,
        companies: newData?.companies?.map(({ _id: id }) => id),
      };
      if (newData?.headquarter) {
        const previousHeadquarter = {
          id: userQuery.data?.headquarter.id,
          name: userQuery.data?.headquarter.name,
        };
        setUserHeadquarter(previousHeadquarter);
      }
      if (newData?.department) {
        const previousDepartment = {
          id: userQuery.data?.department.id,
          name: userQuery.data?.department.name,
        };
        setUserDepartment(previousDepartment);
      }
      if (newData?.area) {
        const previousArea = {
          id: userQuery.data?.area.id,
          name: userQuery.data?.area.name,
        };
        setUserArea(previousArea);
      }
      reset(initialValues);
    }
  }, [reset, userQuery.data]);

  watch((formValues: FieldValues) => {
    const { department, headquarter, area } = formValues;
    setUserDepartment(department);
    setUserHeadquarter(headquarter);
    setUserArea(area);
  });

  const toggleOpenActivateUserDialog = () => setIsOpen((prev) => !prev);

  const handleChangeSelectedRole = (value: any) => {
    setModulesHaveBeenOverrided(false);
    setNotificationsHaveBeenOverrided(false);
    setTempModules([]); // Empty que overrided modules
    setTempNotifications([]); // Empty que overrided notifications
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
      errorMessage('Se requiere un rol para el usuario');
    }

    if (!modulesHaveBeenOverrided) delete newUser.overridedModules;
    if (!notificationsHaveBeenOverrided) delete newUser.overridedNotifications;

    await mutateAsync({ data: newUser, userId });
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

  const handleTabChange = (_: unknown, newValue: number) => setActiveTab(newValue);

  const onSubmitToggleActiveUser = async () => {
    await mutateAsyncToggleActiveUser({ id: userId });
  };

  const handleSubmitToggleActiveUser = () => {
    onSubmitToggleActiveUser();
    toggleOpenActivateUserDialog();
  };

  // Ugly code due to react-hook-form behaviour on object type fields initialization
  const userHasObjectFields = !!userQuery.data?.area
    || !!userQuery.data?.headquarter
    || !!userQuery.data?.department;

  const fieldsAreInitialized = !!userArea || !!userDepartment || !!userHeadquarter;

  let canRenderGeneralInfo = false;
  if (activeTab === 0 && userHasObjectFields && fieldsAreInitialized) canRenderGeneralInfo = true;
  if (activeTab === 0 && !userHasObjectFields) canRenderGeneralInfo = true;

  useEffect(() => {
    const form = getValues();
    if (!isBoolean(form.wpNotifications)) {
      setValue('wpNotifications', false);
    }
    if (!isBoolean(form.emailNotifications)) {
      setValue('emailNotifications', false);
    }
  }, [getValues]);

  return (
    <>
      <Dialog open={isOpen} onClose={toggleOpenActivateUserDialog}>
        <DialogTitle>{label}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {
              userQuery?.data?.active
                ? t('managements.deactivateMessage', { name: `${userQuery?.data?.name} ${userQuery?.data?.lastName}` })
                : t('managements.activateMessage', { name: `${userQuery?.data?.name} ${userQuery?.data?.lastName}` })
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleOpenActivateUserDialog}>{t('cancel')}</Button>
          <Button variant="contained" onClick={handleSubmitToggleActiveUser}>{label}</Button>
        </DialogActions>
      </Dialog>
      <Drawer
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { pb: 5, width: 600 } }}
        anchor="right"
        ModalProps={{
          keepMounted: false,
        }}
      >
        <Stack
          direction="column"
          justifyContent="space-between"
          spacing={2}
          sx={{ p: 2 }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
          >
            <Typography variant="h4" gutterBottom>{t('managements.updateUser')}</Typography>
            <Button
              variant="contained"
              onClick={toggleOpenActivateUserDialog}
            >
              {label}
            </Button>
          </Stack>
          <Tabs
            value={activeTab}
            indicatorColor="primary"
            onChange={handleTabChange}
          >
            <Tab
              sx={{ px: 1 }}
              label={t('managements.usersModule.generalInfo')}
              key={1}
            />
            <Tab
              sx={{ px: 1 }}
              label={t('managements.usersModule.modulesAndPermissions')}
              key={2}
            />
            <Tab
              sx={{ px: 1 }}
              label={t('managements.usersModule.notifications')}
              key={3}
            />
          </Tabs>
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            {canRenderGeneralInfo && (
            <GeneralInfo
              userArea={userArea}
              userDepartment={userDepartment}
              userHeadquarter={userHeadquarter}
              environments={userQuery.data?.environments ?? []}
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
                userData={userQuery?.data}
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
            <Button
              sx={{ width: '100%' }}
              variant="contained"
              type="submit"
              loading={isSubmitting}
            >
              {t('generic.save')}
            </Button>
          </form>
        </Stack>
      </Drawer>
    </>
  );
}
