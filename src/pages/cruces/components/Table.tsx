import { useState } from 'react';
import { Chip } from '@mui/material';
import {
  GridValueGetterParams, GridColDef, GridRenderCellParams,
} from '@mui/x-data-grid';
import { parseDate, DD_MM_YYYY_HH_MM } from '@/utils';
import { useDataGrid, useCustomNavigate } from '@/hooks';
import { useCrucesList } from '../hooks/react-query-cruces-list';
import { getUserName } from '../adapters';
import DataGrid from '../../../components/datagrid/DataGrid';
import ButtonToolbar2 from './ButtonToolbar';
import { ExtraComponents } from './ExtraComponents';

function Home() {
  const crossingByTeam = 3;
  const { goTo } = useCustomNavigate();
  const { variables, setVariables } = useDataGrid();
  const [filterBy, setFilterBy] = useState(crossingByTeam);

  const {
    data, isLoading, isFetching,
  } = useCrucesList({
    variables: {
      ...variables,
      filterBy,
      sort: JSON.stringify({ status: 1, openingDate: -1 }),
    },
  });

  const actionFunction = (action: string) => {
    switch (action) {
      case 'crear-operacion':
        goTo('/cruces/create/new');
        return '';
      case 'mis-operaciones':
        return setFilterBy(1);
      case 'operaciones-equipo':
        return setFilterBy(2);
      default:
        return '';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'user',
      headerName: 'Especialista',
      width: 200,
      renderCell: (
        params: GridRenderCellParams,
      ) => getUserName(params),
    },
    {
      field: 'openingDate',
      headerName: 'Fecha de apertura',
      width: 150,
      valueGetter: ({ value }: GridValueGetterParams<string>) => parseDate(value, DD_MM_YYYY_HH_MM),
    },
    {
      field: 'number',
      headerName: 'Numero de operacion',
      width: 150,
    },
    {
      field: 'status',
      headerName: 'Esattus',
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
      headerName: 'Cliente',
      width: 200,
    },
    {
      field: 'placas',
      headerName: 'Placas',
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
      headerName: 'Numero economico',
      width: 150,
    },
    {
      field: 'type',
      headerName: 'Tipo',
      width: 150,
    },
    {
      field: 'anden',
      headerName: 'Anden',
      width: 150,
    },
    {
      field: 'checker',
      headerName: 'Revisor',
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
      headerName: 'Comentarios',
      width: 150,
    },
  ];

  return (
    <DataGrid
      columns={columns}
      rows={data?.rows ?? []}
      loading={isLoading || isFetching}
      actions={[
        <ButtonToolbar2 key="ButtonAdd" action="crear-operacion" actionFunction={actionFunction} />,
      ]}
      onRowDoubleClickUrl="/cruces"
      mode="server"
      extraToolbarComponents={[<ExtraComponents actionFunction={actionFunction} key="CustomToolbar" />]}
      serverOptions={{
        totalRowCount: data?.total ?? 0,
        handleChange: setVariables,
      }}
      pageSize={10}
    />
  );
}

export default Home;
