import {
  DataGridPro as DataGrid,
  GridColumns,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@mui/x-data-grid-pro';
import { useTheme } from '@mui/material';

type Rows = {
  id: string;
  reference: string;
  gop?: string | null;
};

type Props = {
  columns: GridColumns;
  rows: Rows[];
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

export default function TableReferences({ columns, rows }: Props) {
  const theme = useTheme();
  const color = theme.palette.mode === 'light' ? '#000' : '#fff';

  return (
    <DataGrid
      disableSelectionOnClick
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
      autoHeight
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      rowsPerPageOptions={[5]}
      pageSize={10}
    />
  );
}
