/* eslint-disable react/jsx-props-no-spreading */
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
import { useParams } from 'react-router-dom';
import { useState, SyntheticEvent } from 'react';

const getValidStatus = (status: string) => {
  switch (status) {
    case 'documentsReady':
      return 0;
    case 'documentsDelivered':
      return 1;
    default:
      return 0;
  }
};

const TABS_OPTIONS = ['documentsReady', 'documentsDelivered'] as const;
type TabOption = typeof TABS_OPTIONS[number];

export type Toolbar = {
  actionFunction: (action: TabOption) => void;
};

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export function CustomToolbar({ actionFunction }: Toolbar) {
  const theme = useTheme();
  const { status } = useParams();
  const color = theme.palette.mode === 'light' ? '#000' : '#fff';
  const [tabIndex, setTabIndex] = useState<number>(getValidStatus(status || 'documentsReady'));

  const handleTabChange = (_e: SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    actionFunction(TABS_OPTIONS[newValue]);
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
          aria-label="basic tabs example"
          TabIndicatorProps={{
            style: {
              backgroundColor: 'blue',
              visibility: 'hidden',
            },
          }}
        >
          <Tab
            label="Documentos Listos"
            sx={{
              borderRadius: '80px 0px 0px 80px',
              padding: '10px',
              border: '1px solid #9CC7F3',
              borderRightColor: 'transparent',
              marginRight: '0px !important',
            }}
            {...a11yProps(0)}
          />
          <Tab
            label="Documentos Entregados"
            sx={{
              borderRadius: '0px 80px 80px 0px',
              padding: '10px',
              border: '1px solid #9CC7F3',
              borderLeftColor: 'transparent',
            }}
            {...a11yProps(1)}
          />
        </Tabs>
      </Stack>
      <GridToolbarContainer>
        <GridToolbarColumnsButton style={{ color }} />
        <GridToolbarFilterButton style={{ color }} />
        <GridToolbarDensitySelector style={{ color }} />
        <GridToolbarExport style={{ color }} />
      </GridToolbarContainer>
    </Box>
  );
}
