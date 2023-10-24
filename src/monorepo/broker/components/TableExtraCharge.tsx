import { DataGridPro } from '@mui/x-data-grid-pro';
import { useTheme } from '@mui/material';

type Rows = {
  id: number;
  sapid: string;
  qty: number;
  charge: string;
};
type Props = {
  charges: Rows[];
};

export default function TableExtraCharge({ charges }: Props) {
  const theme = useTheme();
  const color = theme.palette.mode === 'light' ? '#000' : '#fff';
  const columns = [
    {
      field: 'sapid',
      headerName: 'SAP ID',
      width: 250,
    },
    {
      field: 'qty',
      headerName: 'Quantity',
      width: 100,
    },
    {
      field: 'charge',
      headerName: 'Charge',
      flex: 1,
    },
  ];

  return (
    <DataGridPro
      sx={{
        color,
      }}
      disableSelectionOnClick
      autoHeight
      columns={columns}
      rows={charges}
      getRowId={(row) => row.id}
    />
  );
}
