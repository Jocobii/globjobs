/* eslint-disable react/no-unstable-nested-components */
import { useState, useEffect, ChangeEvent } from 'react';
import {
  IconButton, Chip, Stack, TextField, MenuItem,
} from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import dayjs from 'dayjs';
import { GridFilterInputValueProps } from '@mui/x-data-grid-pro';
import { get } from 'lodash';

import { stringIncludes } from '@gsuite/shared/utils';
import { DataGrid, ModelOptions } from '@gsuite/ui/DataGrid';
import { type Variables } from 'graphql-request';
import { CLIENT_ROLE, COACH_SPECIALIST_ROLE } from '@gsuite/shared/utils/constants';
import { TFunctionType } from '@gsuite/typings/common';
import { useGetUsers } from '../../users/api/getUsers';

const DEFAULT_FILTER = {
  filter: [
    {
      o: 'ne',
      v: COACH_SPECIALIST_ROLE,
      c: 'role',
    },
    {
      o: 'ne',
      v: CLIENT_ROLE,
      c: 'role',
    },
  ],
};

type Props = {
  actionsHeader?: Array<JSX.Element> | JSX.Element | null | string;
  t: TFunctionType;
  onRowSelect: (users: string[]) => void;
  selectedTeam?: string;
};

export default function List({
  actionsHeader = null,
  t,
  onRowSelect,
  selectedTeam = undefined,
}: Props) {
  const [variables, setVariables] = useState<Variables>(DEFAULT_FILTER);

  const query = useGetUsers({ variables });

  useEffect(() => {
    setVariables((prev) => ({
      ...prev,
      page: 1,
      teamId: selectedTeam,
    }));
  }, [selectedTeam]);

  const handleRefresh = () => query.refetch();

  const handleDataGridEvents = (event: ModelOptions) => {
    if (Object.keys(event).length > 0) {
      setVariables((prev) => ({
        ...prev,
        ...event as object,
        filter: [
          ...DEFAULT_FILTER.filter,
          ...get(event, 'filter', []),
        ],
      }));
    }
  };

  return (
    <DataGrid
      onClearConfig={() => setVariables({ ...DEFAULT_FILTER, teamId: selectedTeam })}
      getRowId={({ id }) => id}
      loading={query.isLoading || query.isFetching}
      checkboxSelection
      columns={[
        {
          field: 'name',
          headerName: t('managements.name'),
          width: 200,
        },
        {
          field: 'lastName',
          headerName: t('managements.lastName'),
          width: 200,
        },
        {
          headerName: t('managements.active'),
          width: 200,
          field: 'active',
          sortable: false,
          filterOperators: [
            {
              label: 'Equals',
              value: 'Equals',
              getApplyFilterFn: (filterValue) => (params) => params
                .value.toLowerCase().includes(String(filterValue).toLowerCase()),
              InputComponent: ({ applyValue, item }: GridFilterInputValueProps) => (
                <TextField
                  select
                  variant="standard"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={item.value}
                  label="Value"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => applyValue({ ...item, value: e.target.value || '' })}
                  fullWidth
                >
                  <MenuItem key={1} value="active">
                    Active
                  </MenuItem>
                  <MenuItem key={2} value="inactive">
                    Inactive
                  </MenuItem>
                </TextField>
              ),
            },
          ],
          renderCell: ({ value }) => (
            <Chip
              sx={{
                fontWeight: 'bold',
              }}
              variant="outlined"
              color={value ? 'success' : 'error'}
              label={value ? 'Active' : 'Inactive'}
            />
          ),
        },
        {
          field: 'emailAddress',
          headerName: t('managements.emailAddress'),
          width: 300,
        },
        {
          field: 'roles.name',
          headerName: t('managements.teams.roleInTeam'),
          width: 200,
          sortable: false,
          renderCell: ({ row }) => {
            const value = row.role;
            if (stringIncludes(value?.name, 'coach')) {
              return (
                <Chip
                  color="primary"
                  label={value?.name || ''}
                />
              );
            }
            return t('managements.teams.specialists');
          },
        },
        {
          field: 'teams.name',
          sortable: false,
          headerName: t('managements.team'),
          resizable: true,
          width: 200,
          pinnable: false,
          renderCell: ({ row }) => {
            const value = row?.teams;
            if (!value || value?.length < 1) {
              return t('managements.teams.unassigned');
            }
            return (
              <Stack
                sx={{
                  width: '100%',
                  overflow: 'scroll',
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                  scrollbarWidth: 'none',
                }}
                direction="row"
                spacing={1}
              >
                {
                  value?.map((x: { name: string }) => (
                    <Chip
                      key={x?.name}
                      sx={{
                        fontWeight: 'bold',
                      }}
                      variant="filled"
                      color="primary"
                      label={x?.name}
                    />
                  ))
                }
              </Stack>
            );
          },
        },
        {
          field: 'lastLogin',
          headerName: t('managements.lastLogin'),
          width: 250,
          type: 'date',
          renderCell: ({ value }) => (value ? dayjs(value).format('YYYY-MM-DD hh:mm:ss A') : 'N/A'),
        },
      ]}
      rows={query.data?.rows ?? []}
      mode="server"
      actions={[
        actionsHeader,
        <IconButton key="more-id" size="large" onClick={handleRefresh} disabled={false}>
          <CachedIcon width={20} height={20} />
        </IconButton>,
      ]}
      serverOptions={{
        onSelectionModelChange: (selection) => {
          const selectedUsers = selection?.map((userId: string) => query?.data?.rows
            .find((row) => row.id === userId));
          onRowSelect(selectedUsers);
        },
        totalRowCount: query.data?.total ?? 0,
        handleChange: handleDataGridEvents,
      }}
    />
  );
}
