import { useState } from 'react';
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
  getRowId?: (row: any) => string | number;
  renderToolbar?: boolean;
};

export function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
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
  getRowId = (row: GridValueGetterParams) => row.id,
  renderToolbar = true,
}: Props) {
  const theme = useTheme();
  const isLightMode: boolean = theme.palette.mode === 'light';
  const apiRef = useGridApiRef();
  const [pageSizeState, setPageSize] = useState(pageSize);

  const handlePageSizeChange = (limitSize: number) => setPageSize(limitSize);

  return (
    <Paper elevation={5} sx={{ p: 1, m: 1, background: isLightMode ? '#fff' : '' }}>
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
        getRowId={getRowId}
        pageSize={pageSizeState}
        onPageSizeChange={handlePageSizeChange}
        rowsPerPageOptions={rowsPerPageOptions}
        disableSelectionOnClick
        checkboxSelection={checkboxSelection}
        autoHeight
        onRowDoubleClick={({ row }) => onRowDoubleClick && onRowDoubleClick(row)}
        components={{
          Toolbar: (renderToolbar && CustomToolbar) || undefined,
          Pagination: CustomPagination,
        }}
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
      />
    </Paper>
  );
}
