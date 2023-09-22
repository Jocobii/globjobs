import {
  Box, Card, Stack, Typography,
} from '@mui/material';

type Props = {
  quantity: number;
  name: string;
  color: string;
  icon: React.ReactNode;
  onClick: () => void;
};

export default function Detail({
  quantity, name, color, icon, onClick,
}: Props) {
  return (
    <Card
      sx={{
        '&:hover': {
          cursor: 'pointer',
        },
        borderColor: `${color} !important`,
        borderBottom: 1,
        borderRadius: 1,
      }}
      onClick={onClick}
    >
      <Box sx={{ position: 'relative' }}>
        <Stack spacing={0} sx={{ p: 3 }}>
          <Stack>
            {icon}
            <Typography variant="h4" align="center">
              {quantity}
            </Typography>
          </Stack>
          <Typography variant="body1" align="center">
            {name}
          </Typography>
        </Stack>
      </Box>
    </Card>
  );
}
