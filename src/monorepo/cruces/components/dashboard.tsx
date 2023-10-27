import {
  LinearProgress,
  useTheme,
  Grid,
} from '@mui/material';
import {
  DataGridPro as DataGrid, GridColDef, GridRowParams,
} from '@mui/x-data-grid-pro';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { usePedimentosList } from '../services/pedimentos-rt-list';

export default function DashboardHome() {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const color = theme.palette.mode === 'light' ? '#000' : '#fff';

  const {
    data, loading,
  } = usePedimentosList();

  const columns: GridColDef[] = [
    {
      field: 'Numero',
      headerName: t('cruces.table.sapId'),
      width: 300,
    },
    {
      field: 'nombre',
      headerName: t('cruces.table.client'),
      width: 300,
    },
    {
      field: 'patente',
      headerName: t('cruces.table.patent'),
      width: 150,
    },
    {
      field: 'aduana',
      headerName: t('cruces.table.customs'),
      width: 150,
    },
    {
      field: 'pedimento',
      headerName: t('cruces.table.pediment'),
      width: 150,
    },
    {
      field: 'referencia',
      headerName: t('cruces.table.reference'),
      width: 150,
    },
    {
      field: 'clave',
      headerName: t('cruces.table.key'),
      width: 150,
    },
    {
      field: 'Semana',
      headerName: t('cruces.table.week'),
      width: 150,
    },
    {
      field: 'FirmaConsolidado',
      headerName: t('cruces.table.consolidatedSign'),
      width: 150,
    },
    {
      field: 'FechaApertura',
      headerName: t('cruces.table.openDate'),
      width: 150,
    },
  ];

  return (
    <Grid container spacing={2} direction="row" style={{ padding: 20 }}>
      <Grid item xs={12}>
        <h2>Dashboard</h2>
      </Grid>
      <Grid item xs={12}>
        <DataGrid
          components={{
            LoadingOverlay: LinearProgress,
          }}
          componentsProps={{
            toolbar: {
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
          rowCount={data?.getRTPedimentos.length}
          rowsPerPageOptions={[5, 20, 50, 100]}
          disableSelectionOnClick
          autoHeight
          columns={columns}
          rows={data?.getRTPedimentos ?? []}
          onRowDoubleClick={(params: GridRowParams) => {
            navigate(`/c/cruces/detail/${params.id}`);
          }}
          loading={loading}
          getRowId={(row) => row.pedimento}
        />
      </Grid>
    </Grid>
  );
}
