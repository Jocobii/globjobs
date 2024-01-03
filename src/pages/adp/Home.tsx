import Conditional from '@gsuite/ui/Conditional';
import {
  TextField,
  MenuItem,
  Typography,
  Grid,
  Button,
  Container,
} from '@mui/material';
import { CircularLoader } from '@gsuite/shared/ui';
import {
  EmptyResult, Filters, PedimentoList,
} from './components';
import { groupByOptions } from './utils';
import { GroupBy } from './typings';
import { useAdp } from './hooks';

export function Home() {
  const {
    handleDownloadFiles,
    handleOnChangeGroupBy,
    handleSubmit,
    handleOpen,
    downloadPedimentosReport,
    selectAllFiles,
    submitAdpToEmail,
    isLoading,
    setPedimentos,
    pedimentos,
    filesFetched,
    groupBy,
    selectAll,
    checked,
    setChecked,
    open,
  } = useAdp();

  if (isLoading) {
    return <CircularLoader />;
  }

  return (
    <Container maxWidth="xl">
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Typography variant="h3">ADP</Typography>
        </Grid>
        <Grid item xs={8} sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
          {
            filesFetched?.body?.data ? (
              <Grid>
                <TextField
                  select
                  placeholder="Agrupar por"
                  defaultValue="groupBy"
                  value={groupBy}
                  sx={{ mr: 1 }}
                  onChange={(e) => handleOnChangeGroupBy(e.target.value as GroupBy)}
                >
                  {groupByOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  onClick={downloadPedimentosReport}
                  variant="outlined"
                  disabled={pedimentos.length === 0}
                  sx={{ m: 1 }}
                >
                  Generar Reporte
                </Button>
                <Button
                  onClick={selectAllFiles}
                  variant="outlined"
                  sx={{ m: 1 }}
                >
                  {selectAll.length > 0 ? `Deseleccionar (${selectAll.length})` : 'Seleccionar Todos'}
                </Button>
                <Button sx={{ m: 1 }} onClick={handleOpen} variant="outlined">Filtros</Button>
              </Grid>
            ) : null
          }
        </Grid>
      </Grid>
      {
      (!filesFetched?.body?.data)
        ? <EmptyResult onClick={handleOpen} />
        : null
      }
      <Conditional
        loadable={!isLoading}
        initialComponent={null}
      >
        {
          filesFetched?.body?.data && (
            <Grid item xs={12}>
              <div style={{ overflow: 'auto', maxHeight: '70vh' }}>
                <PedimentoList
                  data={filesFetched}
                  checked={checked}
                  setChecked={setChecked}
                  isSelectAll={selectAll.length > 0}
                  setPedimentos={setPedimentos}
                  pedimentos={pedimentos}
                />
              </div>
            </Grid>
          )
        }
      </Conditional>
      <Filters open={open} onClose={handleOpen} handleSubmitForm={handleSubmit} />
      {
        filesFetched?.body?.data || checked.length ? (
          <Grid
            container
            direction="row-reverse"
            spacing={2}
          >
            <Grid item>
              <Button
                onClick={() => handleDownloadFiles()}
                variant="contained"
                disabled={!checked.length}
              >
                {
                  checked.length > 0 ? (
                    `Descargar (${checked.length})`
                  ) : 'Descargar'
                }
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                onClick={submitAdpToEmail}
                disabled={!checked.length}
              >
                Enviar por correo
              </Button>
            </Grid>
          </Grid>
        ) : null
      }
    </Container>
  );
}

export default Home;
