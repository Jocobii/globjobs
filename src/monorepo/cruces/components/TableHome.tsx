import { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Chip,
  LinearProgress,
  Stack,
  useTheme,
} from '@mui/material';
import { FieldValues } from 'react-hook-form';
import { DialogComponent } from '@gsuite/shared/ui';
import {
  DataGridPro as DataGrid, GridColDef, GridRenderCellParams, GridRowParams, GridValueGetterParams,
} from '@mui/x-data-grid-pro';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import loadable from '@loadable/component';
import { useTranslation } from 'react-i18next';

import { COACH_CE_ROLE } from '@gsuite/shared/utils/constants';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { filterOption } from '@gsuite/ui/DataGrid/utils';
import { getUserSession } from '@gsuite/shared/contexts/AuthContext';
import LoadingBackdrop from '@gsuite/ui/LoadingBackdrop';
import CustomPagination from '@gsuite/ui/DataGrid/Pagination';
import {
  REQUESTED_OPERATION_STATUS,
} from '@gsuite/shared/seeders/status';
import { useCrossing, defaultState } from '@gsuite/shared/contexts';
import { CustomToolbar } from './CustomToolbar';
import { useAssignUser } from '../services/assign-user';
import { useCrucesList } from '../services/cruces-list';

const AssignSpecialist = loadable(() => import('./AssignSpecialist'), { fallback: <LoadingBackdrop /> });
const AddCruce = loadable(() => import('./forms/addCruce'), { fallback: <LoadingBackdrop /> });

export type Rows = {
  id: string;
};

export type Toolbar = {
  actionFunction: (action: string) => void;
};

type Item = {
  columnField: string;
  operatorValue: string;
  value: string;
};

type ModelOption = {
  sort: 'desc' | 'asc';
  page: number;
  items: Item[];
};

export type ModelOptions = ModelOption | ModelOption[] | number;

export function TableHome() {
  const { t } = useTranslation();
  const crossingByUser = 1;
  const crossingByTeam = 2;
  const [assignUser] = useAssignUser();
  const { successMessage } = useSnackNotification();
  const theme = useTheme();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(15);
  const [variables, setVariables] = useState({});
  const [open, setOpen] = useState<boolean>(false);
  const [openAssign, setOpenAssign] = useState<boolean>(false);
  const [crossingSelect, setCrossingSelect] = useState<string>();
  const [isCoach, setIsCoach] = useState<boolean>(false);
  const [coachId, setCoachId] = useState<string>('');
  const { setCrossing } = useCrossing();
  const [modelOptions, setModelOptions] = useState<any>({});
  const [filterBy, setFilterBy] = useState(crossingByTeam);
  const color = theme.palette.mode === 'light' ? '#000' : '#fff';
  const parseDate = (value?: string) => (value ? dayjs(value).format('DD/MM/YYYY - HH:mm') : 'N/A');

  const getColorByTimeAgo = (value: GridRowParams): string => {
    const { statusHistory } = value.row ?? {};
    if (!Array.isArray(statusHistory) || statusHistory.length === 0) return '';
    const lastStatus = statusHistory[statusHistory.length - 1];
    const lastStatusDate = dayjs(lastStatus?.startedAt);
    const now = dayjs();
    const minutes = now.diff(lastStatusDate, 'm');
    if (minutes < 30) return '';
    if (minutes >= 30 && minutes < 60) return 'MuiDataGrid-row-orange';
    if (minutes >= 60) return 'MuiDataGrid-row-red';
    return '';
  };

  const {
    data: dataCruces, loading, refetch, fetchMore,
  } = useCrucesList({
    variables: {
      ...variables,
      page,
      pageSize,
      ...(Object.keys(modelOptions)?.length > 0 && {
        filter: modelOptions.filter,
      }),
      filterBy,
    },
  });

  useEffect(() => {
    const initialize = async () => {
      try {
        const session = await getUserSession();
        setCoachId(session.user.id);
        setIsCoach(session.user.role === COACH_CE_ROLE);
      } catch (err) {
        setIsCoach(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    setVariables((prev) => ({
      ...prev,
      page,
      pageSize,
      ...(Object.keys(modelOptions)?.length > 0 && {
        filter: modelOptions.filter,
      }),
      // filterBy,
    }));

    fetchMore({ variables });
  }, [filterBy, page, modelOptions]);

  const eventManager = useCallback((options: any) => {
    setModelOptions((prev: any) => filterOption(prev, options));
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 0) {
      return;
    }

    setPage(newPage);
  };

  const handleAttend = async (crossingId: string, userId?: string) => {
    await assignUser({
      variables: {
        crossingId,
        userId,
      },
      onCompleted: () => {
        navigate(`/c/cruces/detail/${crossingId}`);
      },
    });
  };

  const actionAssign = (crossing?: string) => {
    setCrossingSelect(crossing);
    setOpenAssign(!openAssign);
  };

  const handleAssignUser = async ({ userId }: FieldValues) => {
    await assignUser({
      variables: {
        crossingId: crossingSelect,
        userId,
      },
      onCompleted: () => {
        successMessage(t<string>('cruces.specialist_assigned'));
        setOpenAssign(false);
        refetch();
      },
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'user',
      headerName: t<string>('cruces.table.specialistName'),
      width: 200,
      renderCell: (
        params: GridRenderCellParams,
      ) => {
        if (params.row.status?.id === REQUESTED_OPERATION_STATUS) {
          return (
            <Stack direction="row" spacing={1}>
              {isCoach && (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => actionAssign(params.row.id)}
                >
                  {t<string>('cruces.table.assign')}
                </Button>
              )}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleAttend(params.row.id)}
              >
                {t<string>('cruces.table.attend')}
              </Button>
            </Stack>
          );
        }
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
      field: 'openingDate',
      headerName: t<string>('cruces.table.openingDate'),
      width: 150,
      valueGetter: ({ value }: GridValueGetterParams<string>) => parseDate(value),
    },
    {
      field: 'number',
      headerName: t<string>('cruces.crossingNumber'),
      width: 150,
    },
    {
      field: 'status',
      headerName: t<string>('cruces.crossingStatus'),
      width: 200,
      valueGetter: (params: GridValueGetterParams) => {
        const { value } = params;
        return value?.name ?? 'N/A';
      },
      renderCell: (
        params: GridRenderCellParams,
      ) => {
        const { row } = params;
        return <Chip sx={{ backgroundColor: row?.status?.color, color: 'white' }} label={row?.status?.name ?? 'N/A'} />;
      },
    },
    {
      field: 'typeModulation',
      headerName: 'Modulacion',
      width: 200,
      valueGetter: (params: GridValueGetterParams) => {
        const { value } = params;
        return value?.name ?? 'N/A';
      },
      renderCell: (
        params: GridRenderCellParams,
      ) => {
        const { row } = params;
        const typeModulationColor = (type: string) => (type === 'verde' ? '#46B63D' : '#FF4842');
        return <Chip sx={{ backgroundColor: row.typeModulation ? typeModulationColor(row.typeModulation) : '#808080', color: 'white' }} label={String(row?.typeModulation ?? 'N/A').toLocaleUpperCase()} />;
      },
    },
    {
      field: 'client',
      headerName: t<string>('cruces.customer'),
      width: 200,
    },
    {
      field: 'customerUser',
      headerName: 'Solictante',
      width: 200,
      renderCell: (
        params: GridRenderCellParams,
      ) => {
        const { value } = params;
        let nameExist = true;
        if (!value?.name) {
          nameExist = false;
        }

        return nameExist ? `${value?.name} ${value?.lastName}` : 'NA';
      },
    },
    {
      field: 'placas',
      headerName: t<string>('cruces.plates'),
      width: 130,
      renderCell: (
        params: GridRenderCellParams,
      ) => {
        const { value } = params;
        return value ?? 'NA';
      },
    },
    {
      field: 'economicNumber',
      headerName: t<string>('cruces.economicNumber'),
      width: 150,
    },
    {
      field: 'type',
      headerName: t<string>('cruces.crossingType'),
      width: 150,
    },
    {
      field: 'anden',
      headerName: t<string>('cruces.platform'),
      width: 150,
    },
    {
      field: 'checker',
      headerName: t<string>('cruces.verifier'),
      width: 200,
      renderCell: (
        params: GridRenderCellParams,
      ) => {
        const { value } = params;
        let nameExist = true;
        if (!value?.name) {
          nameExist = false;
        }

        return nameExist ? `${value?.name}` : 'NA';
      },
    },
    {
      field: 'comments',
      headerName: t<string>('cruces.comments'),
      width: 150,
    },
  ];

  const mode = 'server';

  const actionFunction = (action: string) => {
    switch (action) {
      case 'Abrir operación':
        return setOpen(true);
      case 'Mis Operaciones':
        return setFilterBy(crossingByUser);
      case 'Operaciones del equipo':
        return setFilterBy(crossingByTeam);
      default:
        return refetch();
    }
  };

  const handleClose = () => {
    setCrossing(defaultState);
    setOpen(false);
  };

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
          '.MuiDataGrid-row-red': {
            backgroundColor: 'red !important',
            opacity: 0.8,
          },
          '.MuiDataGrid-row-orange': {
            backgroundColor: 'orange !important',
            opacity: 0.8,
          },
          color,
          p: 1,
        }}
        pageSize={pageSize}
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
        rowCount={dataCruces?.crossingList.total ?? 0}
        rowsPerPageOptions={[5, 20, 50, 100]}
        disableSelectionOnClick
        autoHeight
        columns={columns}
        rows={dataCruces?.crossingList.rows ?? []}
        onRowDoubleClick={(params: GridRowParams) => {
          navigate(`/c/cruces/detail/${params.id}`);
        }}
        getRowId={({ id }: Rows) => id}
        loading={loading}
        getRowClassName={getColorByTimeAgo}
        onPageSizeChange={(newSize: number) => setPageSize(newSize)}
        onPageChange={(newPage: number) => handlePageChange(newPage + 1)}
      />
      <DialogComponent
        title="Abrir Operacion"
        open={open}
        handleClose={handleClose}
        okButtonVisibility={false}
        cancelButtonVisibility={false}
        fullWidth
        maxWidth="lg"
      >
        <AddCruce
          closeDialog={handleClose}
          refetch={refetch}
        />
      </DialogComponent>
      <AssignSpecialist
        open={openAssign}
        handleClose={actionAssign}
        handleAssignUser={handleAssignUser}
        coachId={coachId}
      />
    </>
  );
}