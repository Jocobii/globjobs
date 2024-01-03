import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DialogComponent } from '@gsuite/shared/ui';
import { DataGrid } from '@gsuite/ui/DataGrid';
import {
  Chip,
  Stack,
  Button,
  Typography,
} from '@mui/material';
import { getStatusName } from '@gsuite/shared/utils/funcs';
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid-pro';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { CrossingListResponse } from '@gsuite/typings/crossing';
import { useState } from 'react';
import { useAssignTrafficUser } from '../../../services/assign-traffic-user';
import { CustomToolbar } from './CustomToolbar';

interface Props {
  data: CrossingListResponse | undefined;
  setVariables: (options: any) => void;
  loading: boolean;
  setStatus: (status: string) => void;
}

function Table({
  data, setVariables, loading, setStatus,
}: Props) {
  const { showSnackMessage } = useSnackNotification();
  const [assignTrafficUser] = useAssignTrafficUser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [operationId, setOperationId] = useState<string | null>(null);

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
          t('cruces.assigned_operation'),
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
              {t('cruces.table.attend')}
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
      headerName: t('cruces.table.operationType').toString(),
      width: 200,
      renderCell: (params: GridRenderCellParams) => {
        const { value } = params;
        return value?.toUpperCase() ?? 'NA';
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
      <CustomToolbar actionFunction={actionFunction} />
      <DataGrid
        mode="server"
        serverOptions={{
          totalRowCount: data?.total ?? 0,
          handleChange: eventManager,
        }}
        columns={columns}
        rows={data?.rows ?? []}
        onRowDoubleClick={(params) => {
          navigate(`/t/operation/detail/${params.id}`);
        }}
        getRowId={({ id }) => id}
        loading={loading}
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
