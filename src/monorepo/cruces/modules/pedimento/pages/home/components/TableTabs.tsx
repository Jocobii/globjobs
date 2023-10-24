import { SyntheticEvent } from 'react';
import {
  Tabs,
  Tab,
  Stack,
} from '@mui/material';

type DataGridActionsProps = {
  tabIndex: number;
  setTabIndex: (value: number) => void;
};

export function TableTabs({
  tabIndex,
  setTabIndex,
}: DataGridActionsProps) {
  const handleTabChange = (_e: SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
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
        <Tab label="Pedimentos Abiertos" sx={{ px: 1 }} />
        <Tab label="Pedimentos Pagados" sx={{ px: 1 }} />
      </Tabs>
    </Stack>
  );
}
