import { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Chip,
  LinearProgress,
  Stack,
  useTheme,
  Avatar,
  Typography,
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
import FlagIcon from '@mui/icons-material/Flag';
import { COACH_CE_ROLE } from '@gsuite/shared/utils/constants';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { filterOption } from '@gsuite/ui/DataGrid/utils';
import { getUserSession } from '@gsuite/shared/contexts/AuthContext';
import LoadingBackdrop from '@gsuite/shared/ui/CircularLoader';
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
const CustomExportModal = loadable(() => import('./CustomExportModal'), { fallback: <LoadingBackdrop /> });

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
  const [openModal, setOpenModal] = useState(false);
  const [modelOptions, setModelOptions] = useState<any>({});
  const handleOpen = () => setOpenModal(!openModal);
  const [filterBy, setFilterBy] = useState(crossingByTeam);
  const color = theme.palette.mode === 'light' ? '#000' : '#fff';
  const parseDate = (value?: string) => (value ? dayjs(value).format('DD/MM/YYYY - HH:mm') : 'N/A');

  const getColorByTimeAgo = (value: GridRenderCellParams): string => {
    const { statusHistory } = value.row ?? {};
    if (!Array.isArray(statusHistory) || statusHistory.length === 0) return '';
    const lastStatus = statusHistory[statusHistory.length - 1];
    const lastStatusDate = dayjs(lastStatus?.startedAt);
    const now = dayjs();
    const minutes = now.diff(lastStatusDate, 'm');
    if (minutes < 30) return '';
    if (minutes >= 30 && minutes < 60) return 'orange';
    if (minutes >= 60) return 'red';
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
        successMessage(t('cruces.specialist_assigned'));
        setOpenAssign(false);
        refetch();
      },
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'delay',
      headerName: '',
      width: 10,
      renderCell: (
        params: GridRenderCellParams,
      ) => {
        const colorByTimeAgo = getColorByTimeAgo(params);
        if (!colorByTimeAgo) return '';
        return <FlagIcon sx={{ color: colorByTimeAgo }} />;
      },
    },
    {
      field: 'user',
      headerName: t('cruces.table.specialistName'),
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
                  {t('cruces.table.assign')}
                </Button>
              )}
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleAttend(params.row.id)}
              >
                {t('cruces.table.attend')}
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
      headerName: t('cruces.table.openingDate'),
      width: 150,
      valueGetter: ({ value }: GridValueGetterParams<string>) => parseDate(value),
    },
    {
      field: 'number',
      headerName: t('cruces.crossingNumber'),
      width: 150,
    },
    {
      field: 'status',
      headerName: t('cruces.crossingStatus'),
      width: 300,
      valueGetter: (params: GridValueGetterParams) => {
        const { value } = params;
        return value?.name ?? 'N/A';
      },
      renderCell: (
        params: GridRenderCellParams,
      ) => {
        const { row } = params;
        return (
          <>
            <Avatar sx={{ width: 15, height: 15, bgcolor: row?.status?.color }}>
              &nbsp;
            </Avatar>
            <Typography variant="body2" sx={{ ml: 1 }}>
              {row?.status?.name}
            </Typography>
          </>
        );
      },
    },
    {
      field: 'trafficType',
      headerName: 'Tipo de trafico',
      width: 130,
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
      headerName: t('cruces.customer'),
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
      headerName: t('cruces.plates'),
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
      headerName: t('cruces.economicNumber'),
      width: 150,
    },
    {
      field: 'type',
      headerName: t('cruces.crossingType'),
      width: 150,
    },
    {
      field: 'anden',
      headerName: t('cruces.platform'),
      width: 150,
    },
    {
      field: 'checker',
      headerName: t('cruces.verifier'),
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
      headerName: t('cruces.comments'),
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
      case 'EXPORT':
        return setOpenModal(true);
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
      <CustomExportModal open={openModal} onClose={handleOpen} />
      <DataGrid
        components={{
          Toolbar: CustomToolbar,
          Pagination: CustomPagination,
          LoadingOverlay: LinearProgress,
        }}
        componentsProps={{
          toolbar: {
            actionFunction,
            isCustomExport: true,
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
