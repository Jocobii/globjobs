import {
  List, Stack, Typography, useTheme, ListItemText,
} from '@mui/material';

type ShippingOrders = {
  shippingOrderId: string;
  receiveOrders: string[];
};

type Props = {
  shipping: ShippingOrders;
  showChildren?: boolean;
};

export default function ListShipping({ shipping, showChildren = false }: Props) {
  const theme = useTheme();
  const color = theme.palette.mode === 'light' ? '#000' : '#fff';

  return (
    <Stack spacing={2}>
      <Typography variant="h6" sx={{ color }}>
        {shipping.shippingOrderId}
      </Typography>
      {showChildren && (
        <List>
          {shipping.receiveOrders.map((receive) => (
            <ListItemText primary={receive} />
          ))}
        </List>
      )}
    </Stack>
  );
}
