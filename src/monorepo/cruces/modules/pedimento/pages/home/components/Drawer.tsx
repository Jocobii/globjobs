import { styled } from '@mui/material/styles';
import {
  Grid, Typography, Button, Stack,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { Dialogeazy } from '@gsuite/ui/Dialogeazy';
import { PedimentoConsolidados, useCreatePedimento } from '../../../services';

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: PedimentoConsolidados;
}

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
}));
export function Drawer({ open, setOpen, data }: Props) {
  const { createCrossingPedimento } = useCreatePedimento();
  const navigate = useNavigate();
  const handleSubmit = async () => {
    const mappedData = {
      aduana: data.aduana,
      patente: data.patente,
      clientNumber: data.claveSAP,
      client: data.cliente,
      pedimento: data.pedimento,
      type: data.Tipo,
    };
    await createCrossingPedimento({
      variables: { crossing: mappedData },
      context: { clientName: 'globalization' },
      onCompleted: (response) => {
        const { createCrossingPedimento: pedimentoCreated } = response;
        navigate(`/p/pedimento/${pedimentoCreated.id}`);
      },
    });
    setOpen(!open);
  };

  return (
    <Dialogeazy
      open={open}
      onClose={() => setOpen(!open)}
    >
      <Container style={{ height: '100%' }}>
        <Stack
          spacing={3}
          style={{ paddingTop: 2, paddingLeft: 3, height: '100%' }}
        >
          <Stack
            direction="column"
            alignItems="center"
            spacing={2}
            style={{ height: '90%' }}
          >
            <Typography variant="h4" gutterBottom>Detalle de pedimento</Typography>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              sx={{ mb: 5 }}
            >
              <Grid item xs={6}>
                <Item><b>Fecha de Apertura</b></Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  {data.FechaApertura}
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item><b>Especialista de CE</b></Item>
              </Grid>
              <Grid item xs={6}>
                <Item>{data.Nombre}</Item>
              </Grid>
              <Grid item xs={6}>
                <Item><b>Cantidad de Facturas</b></Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  {data.remesas}
                </Item>
              </Grid>
            </Grid>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={6}>
                <Item><b>Numero de operacion asociada</b></Item>
              </Grid>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                sx={{ mb: 5 }}
              >
                {
                  data.operations && data.operations.map(({ _id: id, number }) => ((
                    <>
                      <Grid item xs={6}>
                        <Item>{number}</Item>
                      </Grid>
                      <Grid item xs={6}>
                        <Button variant="text">
                          Ver Operacion
                          {id}
                        </Button>
                      </Grid>
                    </>
                  )))
                }
              </Grid>
            </Grid>
          </Stack>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center' }} spacing={2}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpen(!open)}
            >
              Cerrar
            </Button>
            {
            !data?.gtznId ? (
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Agregar Proforma
                </Button>
              </Grid>
            ) : null
          }
          </Stack>
        </Stack>
      </Container>
    </Dialogeazy>
  );
}
