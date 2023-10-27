import { useState, useEffect } from 'react';
import { IconButton, Chip, Stack } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';

import { DataGrid, ModelOptions } from '@gsuite/ui/DataGrid';
import { TFunctionType } from '@gsuite/typings/common';
import { useGetCompanies } from '../api/getCompanies';

type Props = {
  actionsHeader?: Array<JSX.Element> | JSX.Element | null | string;
  selectedTeam?: string;
  onRowSelect: (companies: any[]) => void;
  t: TFunctionType;
};

export default function List({
  actionsHeader = null,
  selectedTeam = undefined,
  onRowSelect,
  t,
}: Props) {
  const [variables, setVariables] = useState({});
  const query = useGetCompanies({ variables });

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
      }));
    }
  };

  return (
    <DataGrid
      getRowId={({ number }) => number}
      loading={query.isLoading || query.isFetching}
      checkboxSelection
      columns={[
        {
          field: 'name',
          headerName: t('managements.company'),
          width: 400,
        },
        {
          field: 'active',
          headerName: t('managements.status'),
          width: 100,
          renderCell({ value }) {
            return <Chip variant="outlined" color={value ? 'success' : 'error'} label={value ? t('managements.active') : t('managements.disabled')} size="small" />;
          },
        },
        {
          field: 'rfc',
          headerName: 'RFC',
          flex: 1,
        },
        {
          field: 'number',
          headerName: t('managements.sapCode'),
          flex: 1,
        },
        {
          field: 'team',
          headerName: t('managements.team'),
          resizable: true,
          filterable: false,
          width: 200,
          renderCell: ({ value }) => {
            if (!value) {
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
                <Chip
                  key={value?.name}
                  sx={{
                    fontWeight: 'bold',
                  }}
                  variant="filled"
                  color="primary"
                  label={value?.name}
                />
              </Stack>
            );
          },
        },
        {
          field: 'email',
          headerName: t('managements.emailAddress'),
          flex: 1,
        },
        {
          field: 'createdAt',
          headerName: t('managements.registrationDate'),
          flex: 1,
        },
      ]}
      rows={query.data?.rows || []}
      mode="server"
      actions={[
        actionsHeader,
        <IconButton key="more-id" size="large" onClick={handleRefresh} disabled={query.isFetching}>
          <CachedIcon width={20} height={20} />
        </IconButton>,
      ]}
      serverOptions={{
        totalRowCount: query.data?.total || 0,
        handleChange: handleDataGridEvents,
        onSelectionModelChange: (selection) => {
          const selectedCompanies = selection?.map((userId: string) => query?.data?.rows
            .find((row) => row.number === userId));
          onRowSelect(selectedCompanies);
        },
      }}
    />
  );
}
