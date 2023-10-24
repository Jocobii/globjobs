import { useState, ChangeEvent, useEffect } from 'react';
import {
  FormControlLabel,
  FormControl,
  InputLabel,
  Checkbox,
  Grid,
  Autocomplete,
  TextField,
  Typography,
  Select,
  MenuItem,
} from '@mui/material';
import { PaymentMethods } from '@gsuite/typings/common';
import SectorComponent from './Sector';
import { SectionProps } from '../../types';

const paymentMethods = Object.values(PaymentMethods);

export default function Section({ handleChange, initial = {} }: SectionProps) {
  const [specificSector, setSpecificSector] = useState(false);
  const [taxesChecked, setTaxesChecked] = useState(false);
  const [oeaChecked, setOeaChecked] = useState(false);
  const [prosecChecked, setProsecChecked] = useState(false);

  useEffect(() => {
    if (Object.keys(initial).length > 0) {
      setTaxesChecked(initial.taxes ?? false);
      setSpecificSector(initial.sectors ?? false);
      setOeaChecked(initial.oea ?? false);
      setProsecChecked(initial.prosec ?? false);
    }
  }, [initial]);

  const taxesTypes = [
    {
      label: 'A',
      key: 'A',
    },
    {
      label: 'AA',
      key: 'AA',
    },
    {
      label: 'AAA',
      key: 'AAA',
    },
  ];

  const merchandiseOptions = [
    {
      label: 'Apartado A',
      key: 'a',
    },
    {
      label: 'Apartado B',
      key: 'b',
    },
    {
      label: 'Apartado C',
      key: 'c',
    },
    {
      label: 'Apartado D',
      key: 'd',
    },
    {
      label: 'Apartado E',
      key: 'e',
    },
    {
      label: 'Apartado F',
      key: 'f',
    },
    {
      label: 'Apartado G',
      key: 'g',
    },
  ];

  return (
    <Grid
      direction="row"
      justifyContent="space-around"
      alignItems="center"
      container
      spacing={2}
      style={{ marginTop: 5 }}
    >
      <Grid container item xs={12} md={4} direction="row">
        <Grid item xs={12} md={4}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={taxesChecked}
                onChange={({ target }) => {
                  handleChange('taxes', target.checked);
                  setTaxesChecked(target.checked);
                }}
              />
            )}
            label="IVA/IEPS"
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Autocomplete
            fullWidth
            value={taxesTypes.find(({ key }) => key === initial?.taxesOption) ?? { label: '', key: '' }}
            options={taxesTypes}
            renderInput={(params) => (
              <TextField
                id={params.id}
                disabled={params.disabled}
                fullWidth={params.fullWidth}
                InputLabelProps={params.InputLabelProps}
                inputProps={params.inputProps}
              // eslint-disable-next-line react/jsx-no-duplicate-props
                InputProps={params.InputProps}
              />
            )}
            disabled={!taxesChecked}
            onChange={(_event, value) => handleChange('taxesOption', value?.key)}
          />
        </Grid>
      </Grid>
      <Grid container item xs={12} md={4} direction="row">
        <Grid item xs={12} md={4}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={oeaChecked}
                onChange={({ target }) => {
                  handleChange('oea', target.checked);
                  setOeaChecked(target.checked);
                }}
              />
            )}
            label="OEA"
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField
            value={initial?.oeaOption ?? ''}
            fullWidth
            onChange={({ target }: ChangeEvent<HTMLInputElement>) => handleChange('oeaOption', target.value)}
            disabled={!oeaChecked}
          />
        </Grid>
      </Grid>
      <Grid container item xs={12} md={4} direction="row">
        <Grid item xs={12} md={4}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={prosecChecked}
                onChange={({ target }) => {
                  handleChange('prosec', target.checked);
                  setProsecChecked(target.checked);
                }}
              />
            )}
            label="PROSEC"
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField
            value={initial?.prosecOption ?? ''}
            fullWidth
            onChange={({ target }: ChangeEvent<HTMLInputElement>) => handleChange('prosecOption', target.value)}
            disabled={!prosecChecked}
          />
        </Grid>
      </Grid>
      <Grid container item xs={12} md={12} spacing={2}>
        <Grid item xs={12} md={4}>
          <Typography>Autorizada por SAT</Typography>
          <FormControlLabel
            control={(
              <Checkbox
                checked={initial?.merchandise ?? false}
                onChange={({ target }) => handleChange('merchandise', target.checked)}
              />
            )}
            label="Mercancia Sensible del Anexo II"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Autocomplete
            value={merchandiseOptions.find(({ key }) => key === initial?.merchandiseOption) ?? { label: '', key: '' }}
            options={merchandiseOptions}
            renderInput={(params) => (
              <TextField
                id={params.id}
                disabled={params.disabled}
                fullWidth={params.fullWidth}
                InputLabelProps={params.InputLabelProps}
                inputProps={params.inputProps}
              // eslint-disable-next-line react/jsx-no-duplicate-props
                InputProps={params.InputProps}
                label="Apartado Autorizado"
              />
            )}
            onChange={(_event, value) => handleChange('merchandiseOption', value?.key)}
          />
        </Grid>
        <Grid item xs={12} md={4} sm={2}>
          <FormControl fullWidth>
            <InputLabel id="paymentSelect">Método de pago predeterminado</InputLabel>
            <Select
              id="paymentSelect"
              label="Método de pago predeterminado"
              type="select"
              fullWidth
              required
              value={paymentMethods.find((element) => element === initial?.defaultPaymentMethod) ?? ''}
              onChange={(e) => handleChange('defaultPaymentMethod', e.target.value as string)}
            >
              {
              paymentMethods.map((p) => (
                <MenuItem value={p} key={p}>{p}</MenuItem>
              ))
            }
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={specificSector}
                onChange={({ target }) => {
                  setSpecificSector(target.checked);
                  handleChange('sectors', target.checked);
                }}
              />
            )}
            label="Inscripción en sectores específicos"
          />
        </Grid>
      </Grid>
      <Grid item xs={12} md={12}>
        {
          specificSector && (
          <SectorComponent
            handleChange={handleChange}
            initial={{ import: initial?.import, export: initial.export }}
          />
          )
        }
      </Grid>
    </Grid>
  );
}
