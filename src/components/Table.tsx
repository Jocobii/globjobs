import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import {
  Grid, Stack, Chip, useTheme,
} from '@mui/material';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridColumns,
  GridValueGetterParams,
  GridRowParams,
  GridRenderCellParams,
  GridValidRowModel,
} from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from '@mui/icons-material';

import { filterOption } from '../utils/datagrid';

export type PaginationOperations = {
  operations: {
    rows: GridValueGetterParams<Rows>[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

type Operations = {
  _id: string;
  number: string;
};

export type Rows = {
  id: string;
  number: string;
  client: string;
  container: string;
  active: boolean;
  completed: boolean;
  notificationDate: string;
  expectedArrivalDate: string;
  releaseUsaDate: string;
  history: [
    {
      userName: string;
    },
  ];
  transportationDate: string;
  receiptUsaDate: string;
  importMxDate: string;
  borderCrossingDate: string;
  warehouseMexDate: string;
  completedDate: string;
  timeElapsed: string;
  gopsReferences: Operations[];
};

type Props = {
  pageSize: number;
  data: PaginationOperations;
  loading: boolean;
  setPageSize: (_: number) => void;
  handlePageChange: (p: number) => void;
  setModelOptions: (variables: any) => void;
};

type ToolbarProps = {
  color: string;
};

function CustomToolbar({ color }: ToolbarProps) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton style={{ color }} placeholder="" />
      <GridToolbarFilterButton style={{ color }} placeholder="" />
      <GridToolbarDensitySelector style={{ color }} placeholder="" />
      <GridToolbarExport style={{ color }} />
    </GridToolbarContainer>
  );
}

const parseDate = (value?: string) => (value ? dayjs(value).format('DD/MM/YYYY HH:mm:ss') : 'N/A');

export const mode = 'server';

export default function Table({
  data,
  loading,
  handlePageChange,
  setPageSize,
  setModelOptions,
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const color = theme.palette.mode === 'light' ? '#000' : '#fff';

  const columns: GridColumns<GridValueGetterParams<Rows>> = [
    {
      headerName: t('broker.table.aggregator'),
      width: 50,
      field: 'gopsReferences',
      renderCell: (
        params: GridRenderCellParams<
        GridValueGetterParams<Rows>,
        GridValidRowModel
        >,
      ) => {
        const { row } = params;
        if (row.gopsReferences && row.gopsReferences.length) return <CheckCircle color="success" />;
        return null;
      },
      valueGetter: (
        params: GridRenderCellParams<
        GridValueGetterParams<Rows>,
        GridValidRowModel
        >,
      ) => {
        const { row } = params;
        if (row.gopsReferences && row.gopsReferences.length) return 'Agrupador';
        return '';
      },
    },
    {
      headerName: t('broker.table.number'),
      width: 200,
      field: 'number',
      valueGetter: (params: GridValueGetterParams<Rows>) => {
        const { value } = params;
        return value || 'N/A';
      },
    },
    {
      headerName: t('broker.table.client'),
      width: 200,
      field: 'client',
      valueGetter: (params: GridValueGetterParams<Rows>) => {
        const { value } = params;
        return value || 'N/A';
      },
    },
    {
      headerName: t('broker.table.completed'),
      width: 200,
      field: 'completed',
      renderCell: (
        params: GridRenderCellParams<
        GridValueGetterParams<boolean>,
        GridValidRowModel
        >,
      ) => {
        const { row } = params;
        const { completed: value, isCanceled } = row;
        if (isCanceled) return <Chip color="error" label="Canceled" sx={{ color: '#fff', fontWeight: 600 }} />;
        return (
          <Chip
            sx={{ fontWeight: 600 }}
            color={value ? 'success' : 'warning'}
            label={value ? 'Completed' : 'In Progress'}
          />
        );
      },
      valueGetter: (
        params: GridRenderCellParams<
        GridValueGetterParams<boolean>,
        GridValidRowModel
        >,
      ) => {
        const { value } = params;
        return value ? 'Completed' : 'In Progress';
      },
    },
    {
      headerName: t('broker.table.createBy'),
      width: 200,
      field: 'history1',
      renderCell: (
        params: GridRenderCellParams<
        GridValueGetterParams<Rows>,
        GridValidRowModel
        >,
      ) => {
        const { row } = params;
        const { history } = row;
        if (history && Array.isArray(history) && history.length > 0) {
          return history[0]?.userName || 'N/A';
        }
        return 'N/A';
      },
      valueGetter: (
        params: GridRenderCellParams<
        GridValueGetterParams<Rows>,
        GridValidRowModel
        >,
      ) => {
        const { row } = params;
        const { history } = row;
        if (history && Array.isArray(history) && history.length > 0) {
          return history[0]?.userName || 'N/A';
        }
        return 'N/A';
      },
    },
    {
      headerName: t('broker.table.updateBy'),
      width: 200,
      field: 'history',
      renderCell: (
        params: GridRenderCellParams<
        GridValueGetterParams<Rows>,
        GridValidRowModel
        >,
      ) => {
        const { row } = params;
        const { history: value, canceledBy } = row;
        if (canceledBy) return canceledBy ?? 'N/A';
        if (value && Array.isArray(value) && value.length > 0) {
          const copyHistory = [...value];
          const lastHistory = copyHistory.pop();
          return lastHistory?.userName || 'N/A';
        }
        return 'N/A';
      },
      valueGetter: (
        params: GridRenderCellParams<
        GridValueGetterParams<Rows>,
        GridValidRowModel
        >,
      ) => {
        const { value } = params;
        if (value && Array.isArray(value) && value.length > 0) {
          const copyHistory = [...value];
          const lastHistory = copyHistory.pop();
          return lastHistory?.userName || 'N/A';
        }
        return 'N/A';
      },
    },
    {
      headerName: t('broker.table.notificationDate'),
      width: 200,
      field: 'notificationDate',
      valueGetter: ({ value }: GridValueGetterParams<string>) => parseDate(value),
    },
    {
      headerName: t('broker.table.expectedArrivalDate'),
      minWidth: 200,
      maxWidth: 400,
      field: 'expectedArrivalDate',
      valueGetter: ({ value }: GridValueGetterParams<string>) => parseDate(value),
    },
    {
      headerName: t('broker.table.releaseUsaDate'),
      width: 200,
      field: 'releaseUsaDate',
      valueGetter: ({ value }: GridValueGetterParams<string>) => parseDate(value),
    },
    {
      headerName: t('broker.table.transportationDate'),
      width: 200,
      field: 'transportationDate',
      valueGetter: ({ value }: GridValueGetterParams<string>) => parseDate(value),
    },
    {
      headerName: t('broker.table.receiptUsaDate'),
      width: 200,
      field: 'receiptUsaDate',
      valueGetter: ({ value }: GridValueGetterParams<string>) => parseDate(value),
    },
    {
      headerName: t('broker.table.importMxDate'),
      width: 200,
      field: 'importMxDate',
      valueGetter: ({ value }: GridValueGetterParams<string>) => parseDate(value),
    },
    {
      headerName: t('broker.table.borderCrossingDate'),
      width: 200,
      field: 'borderCrossingDate',
      valueGetter: ({ value }: GridValueGetterParams<string>) => parseDate(value),
    },
    {
      headerName: t('broker.table.warehouseMexDate'),
      width: 200,
      field: 'warehouseMexDate',
      valueGetter: ({ value }: GridValueGetterParams<string>) => parseDate(value),
    },
    {
      headerName: t('broker.table.completedDate'),
      width: 200,
      field: 'completedDate',
      valueGetter: ({ value }: GridValueGetterParams<string>) => parseDate(value),
    },
    {
      headerName: t('broker.table.timeElapsedTotal'),
      width: 200,
      field: 'timeElapsedTotal',
      valueGetter: ({ value }: GridValueGetterParams<string>) => value || 'N/A',
    },
    {
      headerName: t('broker.table.aggregator'),
      width: 500,
      field: 'gopsReferencesSplitted',
      renderCell: (
        params: GridRenderCellParams<
        GridValueGetterParams<Rows>,
        GridValidRowModel
        >,
      ) => {
        const { row } = params;
        if (row.gopsReferences && row.gopsReferences.length) {
          return row.gopsReferences
            .map((gop: Operations) => gop.number)
            .join(' | ');
        }
        return null;
      },
      valueGetter: (
        params: GridRenderCellParams<
        GridValueGetterParams<Rows>,
        GridValidRowModel
        >,
      ) => {
        const { row } = params;
        if (row.gopsReferences && row.gopsReferences.length) {
          return row.gopsReferences
            .map((gop: Operations) => gop.number)
            .join(' | ');
        }
        return '';
      },
    },
    {
      headerName: 'Motivo de la cancelación',
      width: 200,
      field: 'cancellationReason',
      valueGetter: ({ value }: GridValueGetterParams<string>) => value || '',
    },
  ];
  const eventManager = (options: any) => {
    setModelOptions((prev: any) => filterOption(prev, options));
  };

  return (
    <Grid>
      <Stack spacing={2}>
        <DataGrid
          components={{
            Toolbar: CustomToolbar,
          }}
          componentsProps={{
            toolbar: {
              color,
            },
          }}
          sx={{
            color,
          }}
          disableSelectionOnClick
          autoHeight
          onFilterModelChange={eventManager}
          columns={columns}
          pagination
          onRowDoubleClick={(params: GridRowParams) => {
            const { row } = params;
            if (row?.isCanceled) return;
            if (!row.gopsReferences.length) navigate(`/g/ops/detail/${params.id}`);
          }}
          pageSize={data?.operations?.pageSize || 20}
          rowsPerPageOptions={[20, 50, 100, 500]}
          getRowId={(row: GridValueGetterParams<Rows>) => row.id}
          paginationMode="server"
          rowCount={data?.operations?.total || 0}
          rows={data?.operations?.rows ?? []}
          loading={loading}
          onPageSizeChange={(newSize: number) => setPageSize(newSize)}
          onPageChange={(newPage: number) => handlePageChange(newPage + 1)}
        />
      </Stack>
    </Grid>
  );
}
