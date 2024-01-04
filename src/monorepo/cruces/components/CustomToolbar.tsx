import {
  Box,
  Stack, Tab, Tabs, useTheme,
} from '@mui/material';
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from '@mui/x-data-grid-pro';
import { useState, SyntheticEvent } from 'react';
import {
  PeopleAlt as PeopleAltIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import CachedIcon from '@mui/icons-material/Cached';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { ButtonToolbar } from './ButtonToolbar';

export const ListOption = {
  crossingByUser: 'Mis Operaciones',
  crossingByTeam: 'Operaciones del equipo',
};

export type Toolbar = {
  actionFunction: (action: string) => void;
  isCustomExport?: boolean;
};

export function CustomToolbar({ actionFunction, isCustomExport = false }: Toolbar) {
  const theme = useTheme();
  const color = theme.palette.mode === 'light' ? '#000' : '#fff';
  const [tabIndex, setTabIndex] = useState<number>(0);

  const handleTabChange = (_e: SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    actionFunction(newValue === 0 ? ListOption.crossingByTeam : ListOption.crossingByUser);
  };

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ marginBottom: 3 }}
      >
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          sx={{ mx: 2 }}
        >
          <Tab icon={<PeopleAltIcon />} label="Operaciones del equipo" sx={{ px: 1 }} />
          <Tab icon={<PersonIcon />} label="Mis Operaciones" sx={{ px: 1 }} />
        </Tabs>
        <Stack
          direction={{ xs: 'column', sm: 'row', md: 'row' }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
          sx={{ marginBottom: 3 }}
        >
          <ButtonToolbar
            action="Abrir operación"
            actionFunction={actionFunction}
          />
          <ButtonToolbar
            action="Refresh"
            variant="outlined"
            icon={(
              <CachedIcon width={20} height={20} />
            )}
            actionFunction={actionFunction}
          />
        </Stack>
      </Stack>
      <GridToolbarContainer>
        <GridToolbarColumnsButton style={{ color }} placeholder="" />
        <GridToolbarFilterButton style={{ color }} placeholder="" />
        <GridToolbarDensitySelector style={{ color }} placeholder="" />
        {
          isCustomExport ? (
            <ButtonToolbar
              action="EXPORT"
              variant="text"
              icon={(
                <SystemUpdateAltIcon width={20} height={20} />
              )}
              actionFunction={actionFunction}
              isTable
            />
          ) : (
            <GridToolbarExport style={{ color }} />
          )
        }
      </GridToolbarContainer>
    </Box>
  );
}
