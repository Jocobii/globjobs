import { useState, ChangeEvent, useEffect } from 'react';
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
import _ from 'lodash';

import { SUITE_ENVIRONMENT } from '@gsuite/shared/utils/constants';

import { Role } from '../../roles/types';
import { useRestfulModules } from '../../modules/api/getModulesRestful';

export type Module = {
  name: string;
  key: string;
  checked?: boolean;
  permissions: { name: string; checked: boolean }[];
};

type Props = {
  availableRoles: Partial<Role>[];
  selectedRole: any;
  onRoleChange?: (value: any) => void;
  userModules: Module[];
  onModulesChange: (value: Module[]) => void;
  onModulesHaveBeenOverridedChange: (value: boolean) => void;
  viewRole?: boolean;
  isEdit?: boolean;
};

const modules: any = [{}];

export default function Modules({
  availableRoles,
  selectedRole,
  onRoleChange = () => {},
  userModules, // modules that have been overrided
  onModulesChange,
  onModulesHaveBeenOverridedChange,
  viewRole = true,
  isEdit = false,
}: Props) {
  const [tempModules, setTempModules] = useState<Module[]>([]);
  const handleRoleChange = (e: ChangeEvent<HTMLInputElement>) => onRoleChange(e.target.value);
  const { data: modulesData, isLoading } = useRestfulModules(SUITE_ENVIRONMENT);
  const allModulesLength = modulesData?.modulesRestful?.length ?? 0;

  useEffect(() => {
    let allSuiteModules = modulesData?.modulesRestful ?? [];
    let roleModules = selectedRole?.modules || [];
    if (isEdit) {
      roleModules = userModules;
    }
    allSuiteModules = allSuiteModules?.filter(({ name }) => name !== null) || [];
    roleModules = roleModules?.filter((x: { name: string }) => x.name !== null) || [];

    const mergedModules = allSuiteModules.map(({ name, actions }) => {
      const matchingModuleOnRole = roleModules
        .find((r: { name: string }) => r?.name.toLowerCase() === name?.toLowerCase());
      if (matchingModuleOnRole) return { ...matchingModuleOnRole };
      return {
        name,
        permissions: [],
        ...(actions && {
          permissions: actions.map((x) => ({ name: x, checked: false })),
        }),
      };
    });

    // Map modules that might be missing on the first iteration
    roleModules.forEach((x: { name: string }) => {
      const alreadyMapped = _.find(
        mergedModules,
        (m: { name: string }) => m?.name?.toLowerCase() === x?.name?.toLowerCase(),
      );
      if (!alreadyMapped) mergedModules.unshift(x);
    });

    const mappedModules = mergedModules.map((x: any) => {
      const hasOneOrManyActives = x?.permissions.some((p: { checked: boolean }) => p.checked);
      return {
        ...x,
        checked: hasOneOrManyActives,
      };
    });

    if (userModules && userModules?.length > 0) { // if user has overrided modules
      userModules.forEach(({ name, permissions }) => {
        const matchingModuleIndex = mappedModules
          .findIndex((x: { name: string }) => x?.name.toLowerCase() === name.toLowerCase());
        const isChecked = permissions?.some((x) => x.checked);
        const overridedModule = {
          name,
          permissions,
          checked: isChecked,
        };
        mappedModules[matchingModuleIndex] = overridedModule;
      });
    }
    const newModules = mappedModules ?? [];
    setTempModules(newModules);
    onModulesChange(newModules);
  }, [selectedRole, isLoading]);

  const handleModulesParentChange = (
    event: ChangeEvent<HTMLInputElement>,
    key: string,
  ) => setTempModules((prev) => {
    onModulesHaveBeenOverridedChange(true);
    const prevModuleIndex = prev.findIndex((x: Module) => x.name === key);
    if (prevModuleIndex >= 0) {
      const targetModule = prev[prevModuleIndex];
      const newModule: Module = {
        name: key,
        key,
        checked: event.target.checked,
        permissions: targetModule.permissions?.map((p) => ({
          name: p.name,
          checked: event.target.checked,
        })),
      };

      const oldModules = [...prev];
      oldModules.splice(prevModuleIndex, 1, newModule);
      const result = [...oldModules];
      onModulesChange(result);
      return result;
    }
    const targetModule = modules.find((x: { name: string }) => x?.name === key);
    const targetPermissions = targetModule.permissions;
    const newModule: Module = {
      name: key,
      key,
      checked: true,
      permissions: targetPermissions.map((p: { name: string }) => ({
        name: p.name,
        checked: true,
      })),
    };

    const result = [...prev, newModule];
    onModulesChange(result);
    return result;
  });

  const handleModulesChildrenChange = (
    event: ChangeEvent<HTMLInputElement>,
    parentKey: string,
    childKey: string,
  ) => setTempModules((prev) => {
    onModulesHaveBeenOverridedChange(true);
    const oldModules = [...prev];
    const prevModuleIndex = prev.findIndex((x: Module) => x.name === parentKey);
    const targetModule = prev[prevModuleIndex];
    const prevModules = [...targetModule.permissions];
    const targetPermissionIndex = prevModules.findIndex((x) => x.name === childKey);

    const newNotificationPermission = {
      name: childKey,
      checked: event.target.checked,
    };

    prevModules.splice(targetPermissionIndex, 1, newNotificationPermission);
    oldModules.splice(prevModuleIndex, 1, {
      ...targetModule,
      permissions: prevModules,
    });

    const hasOneOrManyActives = oldModules[prevModuleIndex]
      .permissions
      .some((x) => x.checked);

    oldModules[prevModuleIndex].checked = hasOneOrManyActives;

    const result = [...oldModules];
    onModulesChange(result);
    return result;
  });

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
            {
              !isLoading
              && allModulesLength > 0
              && selectedRole
              && tempModules?.length > 0
              && tempModules?.map((n) => (
                <Accordion key={n.name} sx={{ boxShadow: 'none !important' }}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                  >
                    <FormControlLabel
                      control={(
                        <Checkbox
                          checked={n.checked || false}
                          onChange={(e) => handleModulesParentChange(e, n?.name)}
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
                                  (e) => handleModulesChildrenChange(e, n?.name, p?.name)
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
