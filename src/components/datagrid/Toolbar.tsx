import {
  Box,
  Stack,
  useTheme,
} from '@mui/material';
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from '@mui/x-data-grid';

export const ListOption = {
  crossingByUser: 'Mis Operaciones',
  crossingByTeam: 'Operaciones del equipo',
};

export type Toolbar = {
  extraComponents?: [React.ReactNode];
};

export function CustomToolbar({ extraComponents }: Toolbar) {
  const theme = useTheme();
  const color = theme.palette.mode === 'light' ? '#000' : '#fff';

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        sx={{ marginBottom: 3 }}
      >
        {extraComponents}
      </Stack>
      <GridToolbarContainer>
        <GridToolbarColumnsButton style={{ color }} />
        <GridToolbarFilterButton style={{ color }} />
        <GridToolbarDensitySelector style={{ color }} />
        <GridToolbarExport style={{ color }} />
      </GridToolbarContainer>
    </Box>
  );
}
