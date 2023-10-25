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

export default function Abstract({
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
      }}
      onClick={onClick}
    >
      <Box sx={{ position: 'relative' }}>
        <Stack spacing={1} sx={{ p: 3 }}>
          <Stack spacing={1}>
            <Stack sx={{ minWidth: '100%' }} direction="row" justifyItems="start">
              <Box
                sx={{ 
                  borderRadius: '100%', 
                  backgroundColor: color, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  p: 0.8,
                  boxShadow: 'inset 3px 2px 7px rgba(0, 0, 0, 0.2)'
                }}
              >
                {icon}
              </Box>
            </Stack>
            <Typography variant="h3" align="center">
              {quantity}
            </Typography>
          </Stack>
          <Typography variant="h5" align="center">
            {name}
          </Typography>
        </Stack>
      </Box>
    </Card>
  );
}
