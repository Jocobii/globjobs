import { useState, useEffect } from "react";
import { Module, Notification } from "../types";
import { useRole } from "../api/getRole";
import { useGetModules } from '../api/getModules';
import { NOTIFICATIONS } from "../utils/const";

type Props = {
  roleId?: string;
};

export default function useForm({ roleId }: Props) {
  const { data: modulesInit } = useGetModules();
  const [modules, setModules] = useState<Module[]>([]);
  const [notifications, setNotifications] = useState<Notification>({
    email: false,
    whatsapp: false,
    notifications: NOTIFICATIONS,
  });

  const { data: role } = useRole({ id: roleId });

  useEffect(() => {
    if (modulesInit && (!roleId || roleId === 'create')) {
      setModules(modulesInit);
      return;
    }
  }, [modulesInit, roleId]);

  useEffect(() => {
    if (!role) {
      return;
    }
    if (!role.modules?.length) {
      return;
    }
    if (!role?.notifications) {
      return;
    }
    setModules(role.modules);
    setNotifications(role?.notifications ?? {});
  }, [role, modulesInit]);

  const updateModule = (
    module: Module,
    key: string,
    permission: string,
    checked: boolean,
  ): Module => {
    if (![module.name, module.key].includes(key)) {
      return module;
    }
    const updatedPermissions = module.permissions.map((perm) => {
      if (perm.name === permission || !permission) {
        return { ...perm, checked };
      }
      return { ...perm };
    });

    return { ...module, permissions: updatedPermissions };
  };

  const onChangeModules = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    const { id } = event.target;
    const [modulo, permission] = id.split('-');
    setModules(modules.map((module) => updateModule(module, modulo, permission, checked)));
  };

  const onChangeNotifications = (event: React.SyntheticEvent<Element, Event>, checked: boolean) => {
    if (!(event.target instanceof HTMLInputElement)) {
      return;
    }

    const { id } = event.target;
    const [modulo, permission] = id.split('-');
    if (['email', 'whatsapp'].includes(modulo)) {
      setNotifications({ ...notifications, [modulo]: checked });
      return;
    }

    setNotifications({
      ...notifications,
      notifications: notifications.notifications.map((module) => updateModule(module, modulo, permission, checked))
    })

  }

  return {
    onChangeModules,
    onChangeNotifications,
    modules,
    notifications,
    roleName: role?.name ?? '',
  };
}