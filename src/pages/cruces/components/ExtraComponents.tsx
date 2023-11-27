import { Stack, Tab, Tabs } from '@mui/material';
import { useState, SyntheticEvent } from 'react';
import {
  PeopleAlt as PeopleAltIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

export const ListOption = {
  crossingByUser: 'Mis Operaciones',
  crossingByTeam: 'Operaciones del equipo',
};

export type Toolbar = {
  actionFunction: (action: string) => void;
};

export function ExtraComponents({ actionFunction }: Toolbar) {
  const [tabIndex, setTabIndex] = useState<string>('operaciones-equipo');

  const handleTabChange = (_e: SyntheticEvent, newValue: string) => {
    setTabIndex(newValue);
    actionFunction(newValue === 'operaciones-equipo' ? 'operaciones-equipo' : 'mis-operaciones');
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
    >
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        TabIndicatorProps={{
          style: {
            backgroundColor: 'blue',
            visibility: 'hidden',
          },
        }}
      >
        <Tab
          icon={<PeopleAltIcon />}
          label="Operaciones del equipo"
          value="operaciones-equipo"
          sx={{
            borderRadius: '80px 0px 0px 80px',
            padding: '10px',
            border: '1px solid #9CC7F3',
            borderRightColor: 'transparent',
            marginRight: '0px !important',
          }}
        />
        <Tab
          icon={<PersonIcon />}
          label="Mis Operaciones"
          value="mis-operaciones"
          sx={{
            borderRadius: '0px 80px 80px 0px',
            padding: '10px',
            border: '1px solid #9CC7F3',
            borderLeftColor: 'transparent',
          }}
        />
      </Tabs>
    </Stack>
  );
}
