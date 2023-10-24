import { useState } from 'react';
import { GridRenderCellParams } from '@mui/x-data-grid-pro';
import { Button, Chip, IconButton } from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import { useNavigate } from 'react-router-dom';
import { getStatusName, getMonthName } from '@gsuite/shared/utils/funcs';
import { DataGrid } from '@gsuite/ui/DataGrid';
import { TableTabs } from './TableTabs';
import { useGetPedimentos, PedimentoConsolidados } from '../../../services';
import { CompaniesAutoCompleted } from './CompaniesAutoCompleted';
import { Drawer } from './Drawer';

export type Variables = {
  page: number;
  sort?: string;
  filter?: Array<{
    c: string;
    o: string;
    v: string;
  }>;
};

export function Table() {
  const navigate = useNavigate();
  const [sapNumber, setSapNumber] = useState('');
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [variables, setVariables] = useState({} as Variables);

  const {
    data, loading, totalPages, pageSize, refetch,
  } = useGetPedimentos({
    variables: {
      page: variables?.page || 1,
      params: {
        ...(variables?.sort && { sort: { field: variables.sort, order: variables.sort.includes('-') ? 'desc' : 'asc' } }),
        filter: [
          { c: 'claveSAP', o: 'contains', v: sapNumber },
          ...(tabIndex === 1 ? [{ c: 'pago', o: 'and', v: 'NOT' }] : []),
          ...variables?.filter ?? [],
        ],
      },
    },
  });
  const [open, setOpen] = useState(false);
  const [row, setRow] = useState<PedimentoConsolidados>({} as PedimentoConsolidados);

  const handleDataGridEvents = (event: any) => {
    if (Object.keys(event).length > 0) {
      setVariables(event);
    }
  };

  const columns = [
    {
      field: 'tipo_pedimento',
      headerName: 'Tipo de apertura',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (params.row.clave.toLowerCase() === 'v1' ? 'Virtual' : 'Consolidado'),
    },
    {
      field: 'TipoApertura',
      headerName: 'Tipo de pedimento',
      width: 100,
    },
    {
      field: 'aduana',
      headerName: 'Aduana',
      width: 70,
    },
    {
      field: 'patente',
      headerName: 'Patente',
      width: 80,
    },
    {
      field: 'pedimento',
      headerName: 'Pedimento',
      width: 100,
    },
    {
      field: 'claveSAP',
      headerName: 'SAP',
      width: 70,
    },
    {
      field: 'cliente',
      headerName: 'Nombre',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (params.row.cliente ? params.row.cliente.slice(0, 9) : ''),
    },
    {
      field: 'clave',
      headerName: 'Clave',
      width: 80,
    },
    {
      field: 'tipo_operacion',
      headerName: 'Tipo de operacion',
      width: 150,
    },
    {
      field: 'referencia',
      headerName: 'Uso/Referencia',
      width: 140,
    },
    {
      field: 'semana',
      headerName: 'Periodo Semana',
      width: 150,
    },
    {
      field: 'mes',
      headerName: 'Periodo Mensual',
      width: 150,
      renderCell: (params: GridRenderCellParams) => getMonthName(params.row.mes),
    },
    {
      field: 'FirmaConsolidado',
      headerName: 'Estatus',
      width: 100,
    },
    {
      field: 'status',
      headerName: 'Estatus de la operacion',
      width: 200,
      renderCell: (
        params: GridRenderCellParams,
      ) => {
        const { row: rowStatus } = params;
        if (!rowStatus.status.name) return '';
        return (
          <Chip
            sx={{ backgroundColor: rowStatus?.status?.color }}
            label={getStatusName(rowStatus?.status)}
          />
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <div>
          <Button
            variant="text"
            onClick={() => {
              setRow(params.row as PedimentoConsolidados);
              setOpen(true);
            }}
          >
            Ver Detalle
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <CompaniesAutoCompleted
        setSapNumber={setSapNumber}
      />
      <Drawer
        open={open}
        setOpen={setOpen}
        data={row}
      />
      <DataGrid
        loading={loading}
        onRowDoubleClick={({ row: rowData }) => {
          if (!rowData.gtznId) return;
          navigate(`/p/pedimento/${rowData.gtznId}`);
        }}
        getRowId={({ pedimento }) => pedimento}
        pinnedColumns={{ right: ['actions'] }}
        columns={columns}
        rows={data || []}
        actions={[
          <TableTabs tabIndex={tabIndex} setTabIndex={setTabIndex} />,
          <IconButton key="more-id" size="large" onClick={() => refetch()} disabled={loading}>
            <CachedIcon width={20} height={20} />
          </IconButton>,
        ]}
        mode="server"
        serverOptions={{
          totalRowCount: totalPages * pageSize || 0,
          handleChange: handleDataGridEvents,
        }}
      />
    </>
  );
}
