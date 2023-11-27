import { ControlledSwitch } from '@gsuite/shared/ui';
import {
  Grid, Box, TextField, MenuItem,
} from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { UENS } from '../../../../utils/constants';
import Aaus from './Aaus';

type Props = {
  control: any;
  uenSelected: any[];
};

export default function StrategicBusinessUnit({
  control,
  uenSelected,
}: Props) {
  const [uen, setUen] = useState('');

  const onChangeUEN = (event: ChangeEvent<HTMLInputElement>) => {
    setUen(event.target.value);
  };

  return (
    <Grid
      direction="row"
      container
      spacing={4}
      sx={{ p: 5 }}
    >
      <Grid item xs={12} spacing={2}>
        <Box
          sx={{
            p: 1,
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(5, 1fr)',
            },
          }}
        >
          {UENS.map((item) => (
            <ControlledSwitch
              key={item.key}
              name={item.key}
              title={item.label}
              color="primary"
              control={control}
              disabled={false}
            />
          ))}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box>
          <TextField
            label="Configuracion"
            variant="outlined"
            select
            sx={{ minWidth: '30%' }}
            onChange={onChangeUEN}
            InputLabelProps={{
              shrink: true,
            }}
            disabled={false}
          >
            {uenSelected.map((item) => (
              <MenuItem key={item.key} value={item.key}>
                {item.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Grid>
      {uen === 'aaus' && (
        <Aaus control={control} />
      )}
    </Grid>
  );
}
