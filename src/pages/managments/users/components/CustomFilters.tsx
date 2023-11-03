import { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Stack,
} from '@mui/material';
import { CLIENT_ROLE } from '@/routes/paths';

import { TFunctionType } from '@/typings/common';

export type Filter = {
  filter: Array<{
    c: string;
    o: string;
    v: string;
  }>
} | null;

type DataGridActionsProps = {
  t: TFunctionType;
  setVariables: (variables: Filter) => void;
  variables: any;
  customHandleChange?: (option: number) => void;
};

const createFilter = (tab: number | null): Filter => ({ filter: [{ c: 'active', o: 'equals', v: String(tab) }] });

const TODOS = 0;
const ACTIVE = 1;
const INACTIVE = 2;
const COMPANY_USERS = 3;

export default function DataGridActions({
  t, setVariables, variables, customHandleChange = () => null,
}: DataGridActionsProps) {
  const [value, setValue] = useState(0);

  const handleChange = (_: React.SyntheticEvent, currentTab: number) => {
    customHandleChange(currentTab);
    if (currentTab === TODOS) setVariables(null);
    if (currentTab === ACTIVE) setVariables(createFilter(1));
    if (currentTab === INACTIVE) setVariables(createFilter(0));
    if (currentTab === COMPANY_USERS) {
      setVariables({
        filter: [{ v: CLIENT_ROLE, o: 'equals', c: 'role' }],
      });
    }
    setValue(currentTab);
  };

  useEffect(() => {
    if (Object.keys(variables).length < 1) setValue(0);

    if (variables?.filter && Array.isArray(variables?.filter)) {
      const activeFilter = variables?.filter?.find((x: { c: string, v: string }) => x?.c === 'active') || null;

      if (activeFilter && activeFilter.v === 'active') setValue(1);
      if (activeFilter && activeFilter.v === 'inactive') setValue(2);
    }
  }, [variables]);

  return (
    <Stack direction="row" sx={{ width: '100%', py: 1 }}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        indicatorColor="primary"
        sx={{ mx: 2 }}
        TabIndicatorProps={{
          sx: {
            backgroundColor: '#3A8FE8',
            borderRadius: '10px',
          },
        }}
      >
        <Tab label={t('all')} sx={{ px: 1 }} />
        <Tab label={t('active')} sx={{ px: 1 }} />
        <Tab label={t('inactive')} sx={{ px: 1 }} />
        <Tab label={t('userCompanies')} sx={{ px: 1 }} />
      </Tabs>
    </Stack>
  );
}
