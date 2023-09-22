import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

type Rows = {
  id: number;
  receiveLineItemPackageName?: string;
  receiveLineItemReceivedQty?: number;
  packagesQuantity?: number;
};
type Props = {
  received: Rows[];
};

export default function TableReceived({ received }: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const color = theme.palette.mode === 'light' ? '#000' : '#fff';
  const columns = [
    {
      field: 'receiveLineItemPackageName',
      headerName: t('broker.table.packageName'),
      width: 250,
    },
    {
      field: 'packagesQuantity',
      headerName: t('broker.table.packageQuantity'),
      flex: 1,
    },
    {
      field: 'receiveLineItemReceivedQty',
      headerName: t('broker.table.quantityPackages'),
      flex: 1,
    },
  ];

  return (
    <DataGrid
      disableSelectionOnClick
      sx={{
        color,
      }}
      autoHeight
      columns={columns}
      rows={received}
      getRowId={(row) => row.id}
      rowsPerPageOptions={[5]}
      pageSize={5}
    />
  );
}
