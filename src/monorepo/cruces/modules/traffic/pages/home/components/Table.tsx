import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useSpinningControls from '@gsuite/shared/hooks/useSpinningControls';
import { DialogComponent } from '@gsuite/shared/ui';
import CustomPagination from '@gsuite/ui/DataGrid/Pagination';

import {
  Chip,
  IconButton,
  Stack,
  Button,
  Typography,
  LinearProgress,
  useTheme,
} from '@mui/material';
import { getStatusName } from '@gsuite/shared/utils/funcs';
import { useSnackNotification } from '@gsuite/shared/hooks';
import {
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
  DataGridPro as DataGrid,
  GridRowParams,
} from '@mui/x-data-grid-pro';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { CrossingListResponse } from '@gsuite/typings/crossing';
import { useState } from 'react';
import { CustomToolbar } from './CustomToolbar';
import { useAssignTrafficUser } from '../../../services/assign-traffic-user';

interface Props {
  data: CrossingListResponse | undefined;
  setVariables: (options: any) => void;
  loading: boolean;
  setStatus: (status: string) => void;
  handlePageChange: (p: number) => void;
  setPageSize: (s: number) => void;
}

function Table({
  data, setVariables, loading, setStatus, handlePageChange, setPageSize,
}: Props) {
  const { showSnackMessage } = useSnackNotification();
  const [assignTrafficUser] = useAssignTrafficUser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [operationId, setOperationId] = useState<string | null>(null);
  const theme = useTheme();
  const color = theme.palette.mode === 'light' ? '#000' : '#fff';
  const mode = 'server';

  const {
    hoveredRowId,
    onMouseEnterRow,
    onMouseLeaveRow,
  } = useSpinningControls();

  const handleAttend = (id: string) => {
    setOperationId(id);
  };

  const handleClose = () => {
    setOperationId(null);
  };

  const handleConfirmAttend = async () => {
    await assignTrafficUser({
      variables: {
        crossingId: operationId,
      },
      onCompleted: () => {
        handleClose();
        showSnackMessage(
          t<string>('cruces.assigned_operation'),
          'success',
          {
            vertical: 'top',
            horizontal: 'right',
          },
          500,
          () => {
            navigate(`/t/operation/detail/${operationId}`);
          },
        );
      },
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'trafficUser',
      headerName: 'Especialista en tráfico',
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params;
        if (row?.trafficUser) {
          const { name, lastName } = row.trafficUser;
          return `${name} ${lastName}`;
        }
        return (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={1}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleAttend(params.row.id)}
            >
              {t<string>('cruces.table.attend')}
            </Button>
          </Stack>
        );
      },
    },
    {
      field: 'user',
      headerName: t('cruces.table.specialist').toString(),
      width: 200,
      renderCell: (
        params: GridRenderCellParams,
      ) => {
        const { value } = params;
        let nameExist = true;
        const lastName = value?.lastName ?? '';
        if (!value?.name && !lastName) {
          nameExist = false;
        }

        return nameExist ? `${value?.name}  ${lastName}` : 'NA';
      },
    },
    {
      field: 'number',
      headerName: t('cruces.table.operation').toString(),
      width: 200,
    },
    {
      field: 'status',
      headerName: t('cruces.table.status').toString(),
      width: 250,
      valueGetter: (params: GridValueGetterParams) => {
        const { value } = params;
        return getStatusName(value);
      },
      renderCell: (
        params: GridRenderCellParams,
      ) => {
        const { row } = params;
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              sx={{
                background: '#1976d2',
                width: 15,
                height: 15,
              }}
            />
            <Typography>{getStatusName(row?.status)}</Typography>
          </Stack>
        );
      },
    },
    {
      field: 'client',
      headerName: t('cruces.table.client').toString(),
      width: 250,
    },
    {
      field: 'placas',
      headerName: t('cruces.table.plate').toString(),
      width: 150,
    },
    {
      field: 'economicNumber',
      headerName: `# ${t('cruces.table.economic').toString()}`,
      width: 150,
    },
    {
      field: 'type',
      headerName: t('cruces.table.specialist').toString(),
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        const { value } = params;
        return value?.toUpperCase() ?? 'NA';
      },
    },
    {
      field: 'actions',
      headerName: '',
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record) => {
        if (hoveredRowId === record.id) {
          return (
            <Stack direction="row">
              <IconButton onClick={() => navigate(`/t/operation/detail/${record.id}`)}>
                <VisibilityIcon />
              </IconButton>
            </Stack>
          );
        }
        return null;
      },
    },
  ];

  const eventManager = (event: any) => {
    if (Object.keys(event).length > 0) {
      setVariables(event);
    }
  };

  const actionFunction = (s: string) => setStatus(s);

  return (
    <>
      <DataGrid
        components={{
          Toolbar: CustomToolbar,
          Pagination: CustomPagination,
          LoadingOverlay: LinearProgress,
        }}
        componentsProps={{
          toolbar: {
            actionFunction,
            color,
            row: {
              onMouseEnterRow,
              onMouseLeaveRow,
            },
          },
        }}
        sx={{
          overflowX: 'scroll',
          '.MuiDataGrid-columnSeparator': {
            display: 'none',
            margin: 2,
          },
          '&.MuiDataGrid-root': {
            border: 'none',
          },
          color,
          p: 1,
        }}
        pageSize={12}
        pagination
        paginationMode={mode}
        sortingMode={mode}
        filterMode={mode}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...(mode === 'server' && {
          onSortModelChange: eventManager,
          onPageChange: eventManager,
          onPageSizeChange: eventManager,
          onFilterModelChange: eventManager,
        })}
        rowCount={data?.total ?? 0}
        rowsPerPageOptions={[5, 20, 50, 100]}
        disableSelectionOnClick
        autoHeight
        columns={columns}
        rows={data?.rows ?? []}
        onRowDoubleClick={(params: GridRowParams) => {
          navigate(`/t/operation/detail/${params.id}`);
        }}
        getRowId={({ id }) => id}
        loading={loading}
        onPageSizeChange={(newSize: number) => setPageSize(newSize)}
        onPageChange={(newPage: number) => handlePageChange(newPage + 1)}
      />
      <DialogComponent
        open={!!operationId}
        title="Mensaje de confirmacion"
        okText="Atender Operación"
        handleClose={handleClose}
        handleConfirm={handleConfirmAttend}
      >
        <Typography variant="h6">¿Estas Seguro que deseas atender esta Operacion?</Typography>
      </DialogComponent>
    </>
  );
}

export default Table;
