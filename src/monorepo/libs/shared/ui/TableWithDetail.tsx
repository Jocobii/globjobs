import { useState, useCallback, useEffect } from 'react';

import {
  DataGridPro as DataGrid,
  GridRowParams,
  GridValueGetterParams,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridRenderCellParams,
  useGridApiRef,
} from '@mui/x-data-grid-pro';

import { Paper, TableCell, useTheme } from '@mui/material';
import { filterOption } from '@gsuite/ui/DataGrid/utils';
import CustomPagination from './Pagination';

type Column = {
  headerName: string;
  field: string;
  type?: 'numeric' | 'date' | 'boolean';
  width?: number;
  align?: 'left' | 'right' | 'center';
  headerAlign?: 'left' | 'right' | 'center';
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  renderCell?: (params: GridRenderCellParams) => string | JSX.Element;
};

type Props = {
  title?: string;
  columns: Column[];
  rows?: GridValueGetterParams[];
  checkboxSelection?: boolean;
  loading?: boolean;
  pageSize?: number;
  rowsPerPageOptions?: Array<number>;
  rowHeight?: number;
  onRowDoubleClick?: (row: GridRowParams) => void;
  getDetailPanelContent: (params: GridRowParams) => React.ReactNode | JSX.Element | null;
  handlePageChange: (p: number) => void;
  rowCount?: number;
  eventChange: (variables: unknown) => void;
};

type ToolbarProps = {
  color: string,
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

export default function Table({
  columns,
  rows = [],
  checkboxSelection = false,
  loading = false,
  pageSize = 10,
  rowsPerPageOptions = [10, 25, 50, 100, 500],
  rowHeight = 50,
  title = '',
  onRowDoubleClick = () => null,
  getDetailPanelContent,
  handlePageChange,
  rowCount = 0,
  eventChange,
}: Props) {
  const apiRef = useGridApiRef();
  const [pageSizeState, setPageSize] = useState(pageSize);
  const [modelOptions, setModelOptions] = useState<any>({});
  const theme = useTheme();
  const isLightMode: boolean = theme.palette.mode === 'light';

  const handlePageSizeChange = (limitSize: number) => setPageSize(limitSize);

  const eventManager = useCallback((options: any) => {
    setModelOptions((prev: any) => filterOption(prev, options));
  }, []);

  useEffect(() => {
    eventChange(modelOptions);
  }, [modelOptions]);

  return (
    <Paper elevation={5} sx={{ p: 1, m: 1 }}>
      {title && (
        <TableCell align="center" colSpan={2} key={title}>
          {title}
        </TableCell>
      )}
      <DataGrid
        apiRef={apiRef}
        columns={columns}
        rows={rows}
        loading={loading}
        rowHeight={rowHeight}
        pagination
        getRowId={(row: GridValueGetterParams) => row.id}
        pageSize={pageSizeState}
        onPageSizeChange={handlePageSizeChange}
        rowsPerPageOptions={rowsPerPageOptions}
        disableSelectionOnClick
        checkboxSelection={checkboxSelection}
        autoHeight
        onSortModelChange={eventManager}
        onFilterModelChange={eventManager}
        paginationMode="server"
        onPageChange={handlePageChange}
        onRowDoubleClick={({ row }) => onRowDoubleClick && onRowDoubleClick(row)}
        components={{
          Toolbar: CustomToolbar,
          Pagination: CustomPagination,
        }}
        rowCount={rowCount}
        componentsProps={{
          toolbar: {
            color: isLightMode ? '#000' : '#fff',
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
          color: isLightMode ? '#000' : '#fff',
        }}
        rowThreshold={0}
        getDetailPanelHeight={() => 'auto'}
        getDetailPanelContent={getDetailPanelContent}
      />
    </Paper>
  );
}
