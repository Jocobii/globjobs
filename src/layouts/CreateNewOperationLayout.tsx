import {
  Button,
  Grid, Paper, Stack,
} from '@mui/material';

function CreateNewOperationLayout() {
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
                <Stack spacing={2} direction="column">
                  <Stack direction="row" spacing={2}>
                    <h1>Input</h1>
                    {/* <ControlledSelect
                      name="type"
                      label={t('cruces.crossingType')}
                      control={control}
                      defaultValue=""
                      key="importType-select"
                      errors={errors}
                      disabled={hasUploadedFiles}
                    >
                      {crossingType.map((cruceType) => (
                        <MenuItem key={cruceType} value={cruceType}>
                          {cruceType}
                        </MenuItem>
                      ))}
                    </ControlledSelect> */}
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    <h1>Dropzone</h1>
                    {/* <Dropzone
                      label={t('cruces.files')}
                      files={files}
                      disabled={!isValid}
                      filesSetter={setFiles}
                    /> */}
                  </Stack>
                  <Stack direction="row" spacing={2}>
                    {/* <ControlledTextField
                      label={t('cruces.comments')}
                      register={register}
                      inputType="text"
                      errors={errors}
                      fieldName="comments"
                      key="comments-field"
                    /> */}
                    <h1>Comments</h1>
                  </Stack>
                </Stack>
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
              {/* {t('cruces.onSend.requestOperation')} */}
              Pedir operacion
            </Button>
            <Button
              variant="outlined"
              // onClick={getSubmitHandler(false)}
              // disabled={tree.length === 0 && externalNode.length === 0}
            >
              Guardar operacion
              {/* {t('cruces.save_operation')} */}
            </Button>
            <Button
              variant="outlined"
              // onClick={() => navigate('../all')}
            >
              {/* {t('cruces.cancel')} */}
              Cancelar operacion
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default CreateNewOperationLayout;
