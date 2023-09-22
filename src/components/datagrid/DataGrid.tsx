import {
  memo, useState, useCallback, useEffect, useMemo,
} from 'react';

import {
  Box,
  Card,
  CardHeader,
  LinearProgress,
  useTheme,
  Button,
} from '@mui/material';
import {
  DataGridPro,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridPinnedColumns,
  useGridApiRef,
  GridRowParams,
} from '@mui/x-data-grid-pro';

import type {
  GridColumns, GridRowsProp, GridRowIdGetter, GridColDef,
} from '@mui/x-data-grid';

import WrapTextIcon from '@mui/icons-material/WrapText';

import { SxProps, styled } from '@mui/material/styles';

import { removeDuplicates, filterOption } from '@/utils/datagrid';
import CustomPagination from './Pagination';

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

type ServerOption = {
  totalRowCount: number;
  handleChange: (options: ModelOptions) => void;
  onSelectionModelChange?: (selection: any) => void;
};

type DataGridProps = {
  title?: string;
  columns: GridColumns;
  rows?: GridRowsProp;
  getRowId?: GridRowIdGetter;
  checkboxSelection?: boolean;
  loading?: boolean;
  pageSize?: number;
  rowOptions?: number[];
  mode?: 'client' | 'server';
  serverOptions?: ServerOption;
  actions?: React.ReactNode[];
  extraToolbarComponents?: React.ReactNode[];
  pinnedColumns?: GridPinnedColumns;
  onRowDoubleClickUrl?: string | null;
  sx?: SxProps;
  onClearConfig?: () => void;
  rowFunction?: {
    onMouseEnter?: (event: any) => void;
    onMouseLeave?: () => void;
  },
  withDetail?: boolean,
  getDetailPanelContent?: any
};

const ActionContent = styled('div')(({ theme }) => ({
  flexShrink: 0,
  minHeight: 62,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 3),
}));

type ToolbarProps = {
  color: string,
  loading: boolean,
  onClear: () => void;
  hasClearFn: boolean;
  extraToolbarComponents?: React.ReactNode[];
};

type ClearTableConfigBtnProps = {
  isLoading: boolean;
  onClear: () => void;
  color: string;
};

function ClearTableConfigBtn({ isLoading, onClear, color }: ClearTableConfigBtnProps) {
  return (
    <Button
      disabled={isLoading}
      onClick={onClear}
      startIcon={<WrapTextIcon />}
      sx={{ color: `${color} !important` }}
    >
      Clear Configuration
    </Button>
  );
}

function CustomToolbar({
  color, loading, onClear, hasClearFn, extraToolbarComponents,
}: ToolbarProps) {
  return (
    <GridToolbarContainer>
      <Box sx={{ marginRight: 2}} >{extraToolbarComponents}</Box>
      <GridToolbarColumnsButton style={{ color }} />
      <GridToolbarFilterButton style={{ color }} />
      <GridToolbarDensitySelector style={{ color }} />
      <GridToolbarExport style={{ color }} />
      {hasClearFn && (
        <ClearTableConfigBtn isLoading={loading} onClear={onClear} color={color} />
      )}
    </GridToolbarContainer>
  );
}

function InternalDataGridCustom({
  title = '',
  columns,
  rows = [],
  getRowId = (row) => row['id'],
  checkboxSelection = false,
  loading = false,
  pageSize = 12,
  rowOptions = [10, 25, 50, 100, 500],
  mode = 'client',
  sx = {},
  serverOptions = {
    totalRowCount: 12,
    handleChange: () => null,
    onSelectionModelChange: () => null,
  },
  actions = [],
  onClearConfig = undefined,
  rowFunction = {},
  onRowDoubleClickUrl = null,
  withDetail = false,
  getDetailPanelContent = null,
  extraToolbarComponents = [],
}: DataGridProps) {
  const apiRef = useGridApiRef();
  const { totalRowCount, handleChange, onSelectionModelChange } = serverOptions;
  const [modelOptions, setModelOptions] = useState<any>({});
  const theme = useTheme();
  const isLightMode: boolean = theme.palette.mode === 'light';
  const cellBackground = theme.palette.background.paper;

  const eventManager = useCallback((options: any) => {
    setModelOptions((prev: any) => filterOption(prev, options));
  }, []);

  useEffect(() => {
    handleChange(modelOptions);
  }, [modelOptions, handleChange]);

  const memoizedColumns = useMemo(() => columns, [columns]).map((column, index) => ({
    ...column,
    id: index,
  }));
  return (
    <Card>
      {
        actions.length > 0 ? (
          <ActionContent sx={{ marginTop: 4 }}>
          <CardHeader title={title} sx={{ p: 1 }} />
          <Box sx={{ flexGrow: 1 }} />
          {actions}
        </ActionContent>
        ) : null
      }
      <Box
        sx={{
          minHeight: 420,
        }}
      >
        <DataGridPro
          apiRef={apiRef}
          getRowId={getRowId}
          disableSelectionOnClick
          autoHeight
          sx={{
            ...sx,
            overflowX: 'scroll',
            '.MuiDataGrid-columnSeparator': {
              display: 'none',
              margin: 2,
            },
            '&.MuiDataGrid-root': {
              border: 'none',
            },
            color: isLightMode ? '#000' : '#fff',
            p: 1,
            '.MuiDataGrid-columnHeaderTitleContainer': {
              backgroundColor: cellBackground,
            },
            '& .MuiDataGrid-pinnedColumns': {
              boxShadow: 'none',
              '& .MuiDataGrid-cell': {
                padding: 0,
              },
            },
            '.MuiDataGrid-cell': {
              backgroundColor: cellBackground,
            },
            '.MuiDataGrid-columnHeader': {
              backgroundColor: cellBackground,
            },
          }}
          pagination
          pageSize={pageSize}
          rowsPerPageOptions={rowOptions}
          paginationMode={mode}
          sortingMode={mode}
          filterMode={mode}
          {...(mode === 'server' && {
            onSortModelChange: eventManager,
            onPageChange: eventManager,
            onPageSizeChange: eventManager,
            onFilterModelChange: eventManager,
            rowCount: totalRowCount,
            onSelectionModelChange,
          })}
          checkboxSelection={checkboxSelection}
          rows={rows}
          loading={loading}
          columns={removeDuplicates(memoizedColumns, (it: GridColDef) => it.field)}
          components={{
            Toolbar: CustomToolbar,
            Pagination: CustomPagination,
            LoadingOverlay: LinearProgress,
          }}
          initialState={{ pinnedColumns: { right: ['actions'] } }}
          {...(onRowDoubleClickUrl && {
            onRowDoubleClick: (params: GridRowParams) => {
              window.location.replace(`${onRowDoubleClickUrl}/${params.id}`);
            },
          })
          }
          componentsProps={{
            footer: { status: 'connected' },
            toolbar: {
              extraToolbarComponents,
              color: isLightMode ? '#000' : '#fff',
              loading,
              hasClearFn: !!onClearConfig,
              onClear: () => {
                if (onClearConfig) {
                  onClearConfig();
                  apiRef.current.forceUpdate();
                  apiRef.current.setPage(0);
                  apiRef.current.setFilterModel({ items: [] });
                  setModelOptions({});
                }
              },
            },
            row: { ...rowFunction },
          }}
          {
            ...((withDetail && {
              rowThreshold: 0,
              getDetailPanelHeight: () => 'auto',
              getDetailPanelContent,
            }) || {})
          }
        />
      </Box>
    </Card>
  );
}

const DataGridCustom = memo(InternalDataGridCustom);

export default DataGridCustom;
