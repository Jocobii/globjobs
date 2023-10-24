import { useState, useEffect } from 'react';
import {
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  TextField,
  Typography,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useSnackNotification } from '@gsuite/shared/hooks';

import { useCompaniesSap } from '../utils';
import { CreateComponentProps, Company } from '../types';

export default function SelectCompany({
  handleSelectCompany,
}: CreateComponentProps) {
  const [visible, setVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company>({});
  const { data, loading, error } = useCompaniesSap();
  const { errorMessage } = useSnackNotification();

  const handleVisibility = () => setVisible(!visible);

  type SAPCompany = {
    getSAPCompanies: Company[];
  };
  let filteredCompanies: Company[] = [];
  if (!loading) {
    const sapCompanies = data as unknown as SAPCompany;
    filteredCompanies = sapCompanies.getSAPCompanies
      .filter((sapComp) => !sapComp.existsInDb);
  }

  useEffect(() => {
    if (error) errorMessage('No se pudieron obtener clientes de SAP');
  }, [error, errorMessage]);

  return (
    <>
      <Grid
        container
        direction="row"
      >
        <Grid item>
          <LoadingButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleVisibility()}
            disabled={!data}
            loading={loading}
            sx={{ height: 60, width: 200, marginBottom: '1%' }}
          >
            Agregar Cliente
          </LoadingButton>
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={handleVisibility}
        open={visible}
      >
        <DialogTitle>Agregar Cliente</DialogTitle>
        <DialogContent
          dividers
        >
          <Typography>Ingrese nombre o el número de organización en SAP</Typography>
          <Autocomplete
            style={{ marginBottom: 30, marginTop: 30 }}
            options={filteredCompanies || []}
            renderInput={(params) => (
              <TextField
                id={params.id}
                disabled={params.disabled}
                fullWidth={params.fullWidth}
                InputLabelProps={params.InputLabelProps}
                inputProps={params.inputProps}
                // eslint-disable-next-line react/jsx-no-duplicate-props
                InputProps={params.InputProps}
                label="Seleccione un cliente"
              />
            )}
            onChange={(_event, value) => {
              if (value) setSelectedCompany(value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleVisibility}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            autoFocus
            onClick={() => {
              handleSelectCompany(selectedCompany);
              handleVisibility();
            }}
          >
            Crear Cuenta de Cliente
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
