import { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  TextField,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useSnackNotification } from '@gsuite/shared/hooks';

import IMMEXComponent from './immex/Section';
import { CompanyFull, CardComponentProps as Props } from '../types';
import { useGetCompany } from '../api/getCompany';
import { useUpdateCompany } from '../api/updateCompany';
import { useCreateCompany } from '../api/createCompany';

export default function Card({ company, edit = false }: Props) {
  const [openDialog, setDialog] = useState<boolean>(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sapId = company.number;
  const [state, setState] = useState<Partial<CompanyFull>>({
    name: company.name,
    number: company.number,
    email: company.email,
    rfc: company.rfc,
    address: company.address,
    defaultPaymentMethod: company.defaultPaymentMethod,
    type: null,
    import: {},
    export: {},
  });
  const [companyType, setCompanyType] = useState({ label: '', key: '' });
  const [created, setCreated] = useState(false);
  const { data } = useGetCompany({ number: company.number ?? '', config: { enabled: edit } });
  const { mutateAsync: createCompanyMutateAsync, isLoading } = useCreateCompany();
  const { mutateAsync: updateCompanyMutateAsync } = useUpdateCompany({ number: company.number ?? '' });
  const { errorMessage } = useSnackNotification();

  const typeOptions = [
    {
      label: 'IMMEX',
      key: 'immex',
    },
    {
      label: 'Empresa con Registro de la Frontera',
      key: 'empresa',
    },
    {
      label: 'Otra Sociedad Mercantil',
      key: 'otro',
    },
  ];

  const handleChange = (property: string, value: undefined | string | object | boolean) => {
    if (property === 'import' && typeof value === 'object') {
      setState({ ...state, import: { ...state.import, ...value } });
    } else if (property === 'export' && typeof value === 'object') {
      setState({ ...state, export: { ...state.export, ...value } });
    } else {
      setState({ ...state, [property]: value });
    }
  };

  const submitHandler = async () => {
    if (!state.type) return errorMessage('El tipo de empresa es requerido');
    if (state.type === 'immex' && !state.defaultPaymentMethod) return errorMessage('El método de pago predeterminado es requerido');

    if (edit) {
      return updateCompanyMutateAsync({
        data: state,
        number: state.number as string,
      })
        .then(() => setDialog(false))
        .catch(() => {});
    }

    return createCompanyMutateAsync({ data: state as CompanyFull })
      .then(() => {
        setCreated(true);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (edit && data) {
      setState(data);
      const typeInfo = data?.type;
      setCompanyType(typeOptions.find(({ key }) => key === typeInfo) ?? { label: '', key: '' });
    }
  }, [edit, data]);

  return (
    <>
      <Grid
        container
        style={{ padding: 20 }}
      >
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            md={12}
            my={2}
            style={{
              backgroundColor: '#246CF6',
              color: '#fff',
              padding: 20,
            }}
          >
            <Typography>{`${sapId} - ${company.name}`}</Typography>
          </Grid>
          <Grid
            spacing={2}
            container
            item
          >
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Clave de Identificación SAP"
                value={sapId && Number(sapId)}
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Razón Social"
                value={company.name}
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="RFC"
                value={company.rfc}
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          <Typography style={{ color: '#246CF6', fontSize: '1.2em', paddingLeft: 20 }}>Datos Generales</Typography>
          <Grid
            spacing={2}
            container
            item
          >
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Calle y Número"
                value={company.address?.address1}
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Colonia"
                value={company.address?.address2}
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <TextField
                fullWidth
                label="Ciudad"
                value={company.address?.city}
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <TextField
                fullWidth
                label="C.P."
                value={company.address?.postalCode}
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              <TextField
                fullWidth
                label="País"
                value={sapId && sapId.startsWith('2') ? 'USA' : 'México'}
                disabled
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          <Grid container item xs={12} md={12}>
            <Grid item xs={12} md={2}>
              <Autocomplete
                value={companyType}
                options={typeOptions}
                renderInput={(params) => (
                  <TextField
                    id={params.id}
                    disabled={params.disabled}
                    fullWidth={params.fullWidth}
                    InputLabelProps={params.InputLabelProps}
                    inputProps={params.inputProps}
                  // eslint-disable-next-line react/jsx-no-duplicate-props
                    InputProps={params.InputProps}
                    label="Tipo"
                    placeholder="Seleccione una opción"
                  />
                )}
                onChange={(_event, value) => {
                  if (value) {
                    setCompanyType(value);
                    handleChange('type', value.key);
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={12}>
              {
              companyType.key === 'immex' && <IMMEXComponent handleChange={handleChange} initial={state} />
            }
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          spacing={2}
        >
          {edit && (
          <Grid item xs={12} md={2}>
            <LoadingButton variant="outlined" fullWidth onClick={() => navigate(-1)}>
              {t('broker.cancel')}
            </LoadingButton>
          </Grid>
          )}
          <Grid item xs={12} md={2}>
            {
            !created && (
              <LoadingButton
                onClick={edit ? () => setDialog(true) : submitHandler}
                fullWidth
                variant="contained"
                loading={isLoading}
              >
                {!edit ? t('managements.teams.addClient') : t('managements.teams.saveClient')}
              </LoadingButton>
            )
          }
          </Grid>
        </Grid>
      </Grid>
      <Dialog open={openDialog}>
        <DialogTitle>
          <Typography variant="h5">Editar Cliente</Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ textAlign: 'center' }}>
          El cliente
          {` "${company.name}" `}
          sera editado
          <br />
          <br />
          ¿Estas seguro que quieres editar el cliente?
        </DialogContent>
        <DialogActions>
          <Button type="button" variant="outlined" color="primary" onClick={() => setDialog(false)}>Cancelar</Button>
          <Button type="button" variant="contained" color="primary" onClick={submitHandler}>Editar Cliente</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
