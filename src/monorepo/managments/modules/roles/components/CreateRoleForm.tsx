import * as yup from 'yup';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  DialogContent,
  Grid,
  Stack,
  FormGroup,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { HorizontalStepper } from '@gsuite/ui/Stepper';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  // ControlledAutocomplete,
  ControlledTextField,
} from '@gsuite/shared/ui';
import { useEffect, useState } from 'react';
import Button from '@mui/lab/LoadingButton';
import { useCreateRole } from '../api/createRole';
import { useRestfulModules } from '../../modules/api/getModulesForRoles';
// import { useRestfulEnvironments } from '../../modules/api/getEnvironments';

type Props = {
  closeDialog: () => void;
  // refetch: () => void;
};
type Permission = {
  name: string,
  checked?: boolean,
};

type Module = {
  name: string,
  key: string,
  permissions: Permission[]
};

type FormData = {
  name: string,
};

type Role = {
  name: string,
  modules: Module[],
  notifications: {
    email: boolean,
    whatsapp: boolean,
    notifications: Module[],
  },
  environment: string,
};

/// ! hay que mapear de las notificaciones de bd
const notif: Module[] = [{
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

export default function CreateRoleForm({
  closeDialog,
}: Props) {
  const { data } = useRestfulModules();
  const { mutateAsync } = useCreateRole();

  const schema = yup.object({
    name: yup.string().max(50, 'Maximo de caracteres es 50.').required('El nombre es requerido.'),
  });

  const role: Role = {
    name: '',
    modules: [],
    notifications: {
      email: false,
      whatsapp: false,
      notifications: [],
    },
    environment: '',
  };
  const [roleToSave, setRoleToSave] = useState(role);

  const camelize = (str: string) => str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => (index === 0 ? word.toLowerCase() : word.toUpperCase())).replace(/\s+/g, '');

  useEffect(() => {
    const modulesInit: Module[] = [];
    if (data) {
      data.modulesRestful.forEach((m) => {
        if (m.actions) {
          modulesInit.push({
            name: m.name,
            key: camelize(m.name),
            permissions: m.actions ? m.actions.map((p) => ({ name: p, checked: false })) : [],
          });
        }
      });
    }

    const notificatinsInit: Module[] = notif.map((m) => ({
      name: m.name,
      key: m.key,
      permissions: m.permissions.map((p) => ({ name: p.name, checked: false })),
    }));

    const tempRole: Role = {
      name: '',
      modules: modulesInit,
      notifications: {
        email: false,
        whatsapp: false,
        notifications: notificatinsInit,
      },
      environment: '',
    };
    setRoleToSave(tempRole);
    return () => {
      setRoleToSave(role);
    };
  }, [data]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<FieldValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (formData: object) => {
    const modulesChecked: Module[] = [];
    // Filtramos solo los modulos con permisos true
    roleToSave.modules.forEach((m) => {
      const checked = m.permissions.filter((p) => p.checked === true);
      if (checked.length > 0) {
        modulesChecked.push({ ...m, permissions: checked });
      }
    });

    await mutateAsync({
      data: {
        name: (formData as FormData).name,
        modules: modulesChecked,
        notifications: {
          ...roleToSave.notifications,
          notifications: roleToSave.notifications.notifications.map((p) => ({ ...p })),
        },
      },
    }).then(() => closeDialog()).catch(() => console.log('error'));
  };

  /// Las funciones checkParent y checkChild, permiten seleccionar y
  /// deseleccionar los checkbox dle modal, en base a un key
  const checkParentM = (checked: boolean, controlInfo: string[]) => {
    const roleTemp = { ...roleToSave };

    for (let j = 0; j < roleTemp.modules.length; j += 1) {
      const m = roleTemp.modules[j];
      if (m.key === controlInfo[2]) {
        for (let k = 0; k < m.permissions.length; k += 1) {
          m.permissions[k].checked = checked;
        }

        break;
      }
    }

    setRoleToSave(roleTemp);
  };

  const checkParentN = (checked: boolean, controlInfo: string[]) => {
    const roleTemp = { ...roleToSave };

    for (let j = 0; j < roleTemp.notifications.notifications.length; j += 1) {
      const n = roleTemp.notifications.notifications[j];
      if (n.key === controlInfo[2]) {
        for (let k = 0; k < n.permissions.length; k += 1) {
          n.permissions[k].checked = checked;
        }

        break;
      }
    }

    setRoleToSave(roleTemp);
  };

  const checkChildM = (checked: boolean, controlInfo: string[]) => {
    const roleTemp = { ...roleToSave };

    for (let j = 0; j < roleTemp.modules.length; j += 1) {
      const m = roleTemp.modules[j];
      if (m.key === controlInfo[1]) {
        for (let k = 0; k < m.permissions.length; k += 1) {
          if (k === parseInt(controlInfo[2], 10)) {
            m.permissions[k].checked = checked;
            break;
          }
        }
        break;
      }
    }

    setRoleToSave(roleTemp);
  };

  const checkChildN = (checked: boolean, controlInfo: string[]) => {
    const roleTemp = { ...roleToSave };
    for (let j = 0; j < roleTemp.notifications.notifications.length; j += 1) {
      const m = roleTemp.notifications.notifications[j];
      if (m.key === controlInfo[1]) {
        for (let k = 0; k < m.permissions.length; k += 1) {
          if (k === parseInt(controlInfo[2], 10)) {
            m.permissions[k].checked = checked;
            break;
          }
        }
        break;
      }
    }

    setRoleToSave(roleTemp);
  };

  /// Metodo onchange para cada checkbox de modulos y notificaciones
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    const controlInfo = id.split('-');

    if (controlInfo[1] === 'm') {
      checkParentM(checked, controlInfo);
    } else if (controlInfo[1] === 'n') {
      checkParentN(checked, controlInfo);
    } else if (controlInfo[0] === 'm') {
      checkChildM(checked, controlInfo);
    } else if (controlInfo[0] === 'n') {
      checkChildN(checked, controlInfo);
    } else if (controlInfo[1] === 'email' || controlInfo[1] === 'whatsapp') {
      const roleTemp = { ...roleToSave };
      roleTemp.notifications[controlInfo[1]] = checked;
      setRoleToSave(roleTemp);
    }
  };

  /// Regresa los checkbox de modulos del objeto rolesToSave
  const modulos = () => roleToSave.modules.map((m, i) => (
    <Accordion key={`accordion-modules-${m.key}`}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-m-${m.key}${String(i)}`}
        id={`panel-m-${m.key}${String(i)}`}
      >
        <FormControlLabel
          key={`parent-m-lb-${m.key}`}
          label={m.name}
          control={(
            <Checkbox
              id={`chk-m-${m.key}-${String(i)}`}
              checked={m.permissions.filter((p) => p.checked === true).length > 0}
              onChange={onChange}
            />
            )}
        />
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup>
          <Stack
            spacing={{ xs: 1, sm: 2 }}
            direction="row"
            flexWrap="wrap"
          >
            {
                m.permissions.map((p, j) => (
                  <FormControlLabel
                    key={`m-lb-${m.key}-${String(j)}`}
                    control={(
                      <Checkbox
                        id={`m-${m.key}-${String(j)}`}
                        checked={p.checked}
                        onChange={onChange}
                      />
                    )}
                    label={p.name}
                  />
                ))
              }
          </Stack>
        </FormGroup>
      </AccordionDetails>

    </Accordion>
  ));

  /// Regresa los checkbox de notificaciones del objeto rolesToSave
  const notificaciones = () => roleToSave.notifications.notifications.map((n, i) => (
    <Accordion key={`accordion-notify-${n.key}`}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel-n-${n.key}${String(i)}`}
        id={`panel-n-${n.key}${String(i)}`}
      >
        <FormControlLabel
          label={n.name}
          control={(
            <Checkbox
              id={`chk-n-${n.key}-${String(i)}`}
              checked={n.permissions.filter((p) => p.checked === true).length > 0}
              onChange={onChange}
            />
              )}
        />
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup>
          <Stack spacing={{ xs: 1, sm: 2 }} direction="row" flexWrap="wrap">
            {
                n.permissions.map((p, j) => (

                  <FormControlLabel
                    key={`m-lb-${n.key}-${String(j)}`}
                    control={(
                      <Checkbox
                        id={`n-${n.key}-${String(j)}`}
                        checked={p.checked}
                        onChange={onChange}
                      />
  )}
                    label={p.name}
                  />
                ))
              }
          </Stack>
        </FormGroup>
      </AccordionDetails>

    </Accordion>
  ));

  const steps = [{
    name: 'Modulos y Permisos',
    body: (
      <Container maxWidth="lg">
        <Grid
          container
          spacing={2}
          sx={{
            padding: 0,
          }}
        >
          <Grid item lg={12} md={12} sm={12} xs={12}>
            {modulos()}
          </Grid>
        </Grid>
      </Container>
    ),
  },
  {
    name: 'Notificaciones',
    body: (
      <Container maxWidth="lg">
        <Grid
          container
          spacing={2}
          sx={{
            padding: 0,
          }}
        >
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <Stack spacing={3} sx={{ pt: 1 }} direction="row">
              <FormControlLabel
                key="lb-chk-email"
                control={(
                  <Checkbox
                    id="chk-email"
                    checked={roleToSave.notifications.email}
                    onChange={onChange}
                  />
)}
                label="Email"
              />
              <FormControlLabel
                key="lb-chk-whatsapp"
                control={(
                  <Checkbox
                    id="chk-whatsapp"
                    checked={roleToSave.notifications.whatsapp}
                    onChange={onChange}
                  />
)}
                label="Whatsapp"
              />
            </Stack>
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            {notificaciones()}
          </Grid>
        </Grid>
      </Container>
    ),
  }];

  return (
    <DialogContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          spacing={2}
          sx={{
            padding: 0,
          }}
        >
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <ControlledTextField
              label="Nombre del rol"
              register={register}
              inputType="text"
              errors={errors}
              fieldName="name"
              key="name-field"
            />
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <HorizontalStepper
              steps={steps}
              onClose={closeDialog}
              onSubmitButton={
                <Button type="submit" variant="contained">Crear Rol</Button>
              }
            />
          </Grid>
        </Grid>
      </form>
    </DialogContent>

  );
}