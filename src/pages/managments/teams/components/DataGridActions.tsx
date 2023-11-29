import { SyntheticEvent } from 'react';
import {
  Tabs,
  Tab,
  Stack,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';

import { TFunctionType } from '../../../../typings/common';

import { RestfulTeamsResponse } from '../api/restful';

type DataGridActionsProps = {
  tabIndex: number;
  selectedTeam?: string;
  handleTeamChange: (value: string) => void;
  handleTabChange: (_e: SyntheticEvent, newValue: number) => void;
  t: TFunctionType;
  isCustomer: boolean;
  data: RestfulTeamsResponse | undefined;
};

export default function DataGridActions({
  tabIndex,
  selectedTeam = undefined,
  handleTabChange,
  handleTeamChange,
  t,
  isCustomer,
  data,
}: DataGridActionsProps) {
  return (
    <Stack direction="row" sx={{ width: '100%', py: 1 }}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        TabIndicatorProps={{
          sx: { backgroundColor: '#3A8FE8' },
        }}
        sx={{ mx: 2 }}
      >
        <Tab label={t('managements.teams.clients')} sx={{ px: 1 }} />
        <Tab label={t('managements.teams.specialists')} sx={{ px: 1 }} />
      </Tabs>
      <Select
        id="select-team-id"
        value={selectedTeam}
        displayEmpty
        defaultValue=""
        sx={{
          em: {
            fontStyle: 'normal',
          },
        }}
        onChange={(e: SelectChangeEvent) => handleTeamChange(e.target?.value as string)}
        renderValue={(selected) => {
          if (!selected) return <em>{t('managements.teams.teamSelect')}</em>;
          if (selected === 'na') return <em>{t('managements.teams.teamNotAssigned')}</em>;
          return data?.teamsRestful?.find((team) => team.id === selected)?.name || selected;
        }}
      >
        <MenuItem key="no-value" value="">
          {
            isCustomer ? t('managements.teams.allClients') : t('managements.teams.allSpecialists')
          }
        </MenuItem>
        <MenuItem key="na" value="na">
          {t('managements.teams.teamNotAssigned')}
        </MenuItem>
        {
          data?.teamsRestful?.map(({ id, name }) => (
            <MenuItem key={id} value={id}>{name}</MenuItem>
          ))
        }
      </Select>
    </Stack>
  );
}
