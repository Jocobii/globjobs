import { useState, useEffect, ChangeEvent } from 'react';
import {
  Grid,
  Card,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
  FormGroup,
  TextField,
  MenuItem,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as Yup from 'yup';
import { FieldValues, type Control } from 'react-hook-form';

import { ControlledCheckbox } from '../../../../components';

import { Role } from '../../roles/types';

const notifications = [{
  name: 'Operaciones',
  key: 'cross',
  permissions: [
    { name: 'Documentos en proceso' },
    { name: 'Documentos pagados ' },
    { name: 'Documentos listos' },
    { name: 'Documentos entregados' },
    { name: 'Reconocimiento aduanal ' },
    { name: 'Desaduanamiento libre' },
    { name: 'Carpeta de despacho' },
    { name: 'Alertar a equipo de rojos' },
    { name: 'Alertar a finanzas' },
    { name: 'Descarga de layout para creacion de TXT' },
    { name: 'Validacion de TXT ' },
    { name: 'Asignar operación' },
  ],
},
{
  name: 'Pedimentos',
  key: 'pediment',
  permissions: [
    { name: 'Solicitar pedimento' },
    { name: 'Abrir pedimentos predeterminados' },
    { name: 'Consolidados aperturados programados.' },
    { name: 'Pedimentos por cerrar' },
    { name: 'Pedimentos vencidos' },
    { name: 'Pedimentos en riesgo de bloqueo de patente' },
    { name: 'Editar claves de pedimentos' },
    { name: 'Eliminar claves de pedimentos' },
  ],
},
{
  name: 'Administrador de tareas',
  key: 'tasks',
  permissions: [
    { name: 'Tarea asignada' },
  ],
},
{
  name: 'Compras',
  key: 'shoppings',
  permissions: [
    { name: 'Solicitud de compra' },
    { name: 'Compra aprobada' },
    { name: 'Compra provisionada' },
    { name: 'Solicitud de pago de multa' },
  ],
}];

export type Notification = {
  name: string;
  checked?: boolean;
  permissions: { name: string, checked: boolean }[];
};

type Props = {
  availableRoles: Partial<Role>[];
  userNotifications: Notification[];
  onNotificationsChange: (value: Notification[]) => void;
  onOverridedNotificationsChange: (value: boolean) => void;
  control: Control<FieldValues>;
  selectedRole: any;
  onSelectedRoleChange?: (value: any) => void;
  setValue: (field: string, value: any) => void;
  overridedNotifications: boolean;
  userData?: any;
  viewRole?: boolean;
  isEdit?: boolean;
};

export const formSchema = Yup.object().shape({
  wpNotifications: Yup.boolean(),
  emailNotifications: Yup.boolean(),
});

export default function Notifications({
  availableRoles,
  selectedRole,
  onSelectedRoleChange = () => {},
  control,
  userNotifications,
  onNotificationsChange,
  onOverridedNotificationsChange,
  setValue,
  overridedNotifications,
  userData = undefined,
  viewRole = true,
  isEdit = false,
}: Props) {
  const [tempNotifications, setTempNotifications] = useState<Notification[]>([]);
  const handleRoleChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => onSelectedRoleChange(e.target.value);

  useEffect(() => {
    const initialNotifications: Notification[] = notifications.map((x) => ({
      name: x.name,
      checked: false,
      permissions: x.permissions.map((p) => ({
        name: p.name,
        checked: false,
      })),
    }));

    setTempNotifications(initialNotifications);

    if (userNotifications && userNotifications.length > 0) {
      const previousNotifications: Notification[] = userNotifications.map((x: Notification) => ({
        name: x.name,
        checked: x.checked,
        permissions: x.permissions.map((p) => ({
          name: p.name,
          checked: p.checked,
        })),
      }));
      setTempNotifications(previousNotifications);
    }
  }, []);

  const handleNotificationsParentChange = (
    event: ChangeEvent<HTMLInputElement>,
    key: string,
  ) => setTempNotifications((prev) => {
    onOverridedNotificationsChange(true);
    const prevModuleIndex = prev.findIndex((x: Notification) => x.name === key);
    if (prevModuleIndex >= 0) {
      const targetModule = prev[prevModuleIndex];
      const newModule: Notification = {
        name: key,
        checked: event.target.checked,
        permissions: targetModule.permissions?.map((p) => ({
          name: p.name,
          checked: event.target.checked,
        })),
      };

      const oldNotifications = [...prev];
      oldNotifications.splice(prevModuleIndex, 1, newModule);
      const result = [...oldNotifications];
      onNotificationsChange(result);
      return result;
    }
    const targetModule = notifications.find((x) => x.name === key)!;
    const targetPermissions = targetModule.permissions!;
    const newModule: Notification = {
      name: key,
      checked: true,
      permissions: targetPermissions.map((p) => ({
        name: p.name,
        checked: true,
      })),
    };

    const result = [...prev, newModule];
    onNotificationsChange(result);
    return result;
  });

  const handleNotificationsChildrenChange = (
    event: ChangeEvent<HTMLInputElement>,
    parentKey: string,
    childKey: string,
  ) => setTempNotifications((prev) => {
    onOverridedNotificationsChange(true);
    const oldNotifications = [...prev];
    const prevModuleIndex = prev.findIndex((x: Notification) => x.name === parentKey);
    const targetModule = prev[prevModuleIndex];
    const prevNotifications = [...targetModule.permissions];
    const targetPermissionIndex = prevNotifications.findIndex((x) => x.name === childKey);

    const newNotificationPermission = {
      name: childKey,
      checked: event.target.checked,
    };

    prevNotifications.splice(targetPermissionIndex, 1, newNotificationPermission);
    oldNotifications.splice(prevModuleIndex, 1, {
      ...targetModule,
      permissions: prevNotifications,
    });

    const hasOneOrManyActives = oldNotifications[prevModuleIndex]
      .permissions
      .some((x) => x.checked);

    oldNotifications[prevModuleIndex].checked = hasOneOrManyActives;

    const result = [...oldNotifications];
    onNotificationsChange(result);
    return result;
  });
  const getInitialNotifications = (array: Notification[]) => array?.map((n: any) => {
    const isActive = n.permissions?.some((x: any) => x.checked);
    return {
      name: n.name,
      checked: isActive,
      permissions: n.permissions?.map((x: any) => ({
        name: x.name,
        checked: x.checked,
      })),
    };
  }) ?? [];

  useEffect(() => {
    if (selectedRole?.notifications && !isEdit) {
      setValue('wpNotifications', userData?.wpNotifications);
      setValue('emailNotifications', userData?.emailNotifications);
      if (!userData) {
        setValue('wpNotifications', selectedRole?.notifications.whatsapp || false);
        setValue('emailNotifications', selectedRole?.notifications.email || false);
      }

      if (!overridedNotifications) {
        const newInitialNotifications = getInitialNotifications(
          selectedRole?.notifications.notifications,
        );
        setTempNotifications(newInitialNotifications);
        onNotificationsChange(newInitialNotifications);
      }
    }
    if (isEdit) {
      const newInitialNotifications = getInitialNotifications(
        userNotifications,
      );
      setTempNotifications(newInitialNotifications);
      onNotificationsChange(newInitialNotifications);
    }
  }, [selectedRole]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card sx={{ py: 3, boxShadow: 'none' }}>
          {viewRole && (
            <TextField
              sx={{ mb: 3 }}
              select
              InputLabelProps={{
                shrink: true,
              }}
              label="Rol"
              onChange={handleRoleChange}
              fullWidth
              defaultValue={selectedRole?.id}
            >
              {availableRoles.map((r) => (
                <MenuItem key={r.id} value={r.id}>
                  {r.name}
                </MenuItem>
              ))}
            </TextField>
          )}
          <Stack spacing={3}>
            <Stack direction="row" justifyContent="space-around">
              <ControlledCheckbox
                control={control}
                label="Notificaciones por correo eléctronico"
                name="emailNotifications"
              />
              <ControlledCheckbox
                control={control}
                label="Notificaciones por WhatsApp"
                name="wpNotifications"
              />
            </Stack>
            {
              tempNotifications?.map((n) => (
                <Accordion key={n.name} sx={{ boxShadow: 'none !important' }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={n.checked || false}
                          onChange={(e) => handleNotificationsParentChange(e, n?.name)}
                        />
                      )}
                      label={n?.name}
                    />
                  </AccordionSummary>
                  <AccordionDetails
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                    }}
                  >
                    {
                      n?.permissions.map((p) => (
                        <FormGroup key={p.name}>
                          <FormControlLabel
                            control={(
                              <Checkbox
                                checked={p.checked || false}
                                onChange={
                                  (e) => handleNotificationsChildrenChange(e, n?.name, p?.name)
                                }
                              />
                            )}
                            label={p.name}
                          />
                        </FormGroup>
                      ))
                    }
                  </AccordionDetails>
                </Accordion>
              ))
            }
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
