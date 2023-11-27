import { useParams } from 'react-router-dom';
import {
  Button,
  Grid, Paper, Stack,
} from '@mui/material';
import { Form } from './components';
import { useCreateOperation } from '../../hooks';

function CreateNewOperationLayout() {
  const { id } = useParams();
  const {
    files, setFiles, setCrossingValues, nodes,
  } = useCreateOperation(id ?? '');
  console.log('nodes', nodes);
  return (
    <Paper elevation={20}>
      {/* <ConfirmDialog
        open={isOpen}
        handleOpen={handleOpen}
        confirmAction={getSubmitHandler(true)}
        titleBody="cruces.onSend.confirmOperationWarning"
        titleText="cruces.onSend.confirmOperationRequest"
        okText="cruces.onSend.requestOperation"
      /> */}
      <Grid
        container
        direction="row"
        justifyContent="center"
        spacing={2}
        sx={{ p: '10px' }}
      >
        <Grid item lg={3} md={3} sm={3} xs={3}>
          <Grid container spacing={2} sx={{ p: '5px' }}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <Stack
                direction="column"
                justifyContent="space-evenly"
                alignItems="center"
                spacing={2}
              >
                <Form
                  files={files}
                  setFiles={setFiles}
                  setCrossingValues={setCrossingValues}
                />
              </Stack>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={9}>
          <Paper elevation={12} style={{ height: '80vh', backgroundColor: '#00000029' }} sx={{ color: 'gray' }}>
            {/* {
              !loading && (tree.length > 0 || externalNode.length > 0) ? (
                <TreeList
                  crossingId="new"
                  tree={tree}
                  externalNode={externalNode}
                  dispatchFileNode={[]}
                  handleDropTree={handleDropTree}
                />
              ) : null
            } */}
            TreeList
          </Paper>
          <Stack
            direction="row-reverse"
            spacing={2}
            my={2}
          >
            <Button
              variant="contained"
            >
              Enviar a anexo 22
            </Button>
            <Button
              variant="outlined"
              // onClick={getSubmitHandler(false)}
              // disabled={tree.length === 0 && externalNode.length === 0}
            >
              Guardar operacion
            </Button>
            <Button
              variant="outlined"
              // onClick={() => navigate('../all')}
            >
              Cancelar operacion
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default CreateNewOperationLayout;
