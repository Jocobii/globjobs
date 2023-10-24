import React, { useState } from 'react';
import { NodeModels, Issues } from '@gsuite/typings/files';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  LinearProgress,
  IconButton,
  Button,
  TextField,
  DialogActions,
  FormControl,
  FormHelperText,
  Box,
} from '@mui/material';
import { NoteAlt } from '@mui/icons-material';
import ArrowCircleLeftSharpIcon from '@mui/icons-material/ArrowCircleLeftSharp';
import ArrowCircleRightSharpIcon from '@mui/icons-material/ArrowCircleRightSharp';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import { useIssueResolver } from '../services/resolveIssue';
import { useReplaceFile } from '../services/replaceFile';

type Modify = {
  newValue?: string;
  skip?: string;
  type?: string;
};

type ErrorFixerProps = {
  open: boolean;
  crossingId?: string;
  currentFile: number;
  nodes: NodeModels[];
  onClose: () => void;
  nodeId: string;
};

const validateAction = (current: number, total: number) => (current < 0 || current >= total);

function ErrorFixerComponent({
  open, crossingId = '', currentFile, nodes, onClose = () => null,
  nodeId,
}: ErrorFixerProps) {
  const { t } = useTranslation();
  const { resolveIssue } = useIssueResolver();
  const { replaceFile } = useReplaceFile();
  const [nodesTemp, setNodes] = useState<NodeModels[]>(nodes);
  const [userInputText, setUserInputText] = useState('');
  const [current, setCurrent] = useState(0);
  const [currentIssue, setCurrentIssue] = useState(0);
  const currentNode: NodeModels = nodesTemp[current];
  if (!currentNode) return null;
  const { data } = currentNode;
  if (!data) return null;
  const { issues } = data;
  if (!issues) return null;
  const { name } = issues;
  const { issues: fileIssues } = issues;

  let issue = fileIssues[currentIssue];

  const translateType = (type: string) => t<string>(`cruces.issue.type.${type}`);

  const nextIssue = () => {
    if (currentIssue + 1 < fileIssues.length) {
      setCurrentIssue(currentIssue + 1);
      return;
    }
    setCurrentIssue(0);
  };
  let issueResolved: Issues[];

  const modifyIssue = async ({
    newValue,
    skip,
    type = 'error',
  }: Modify) => {
    if (skip === 'all') {
      issues.issues = fileIssues.map((issueItem) => {
        if (issueItem.type === type) {
          return {
            ...issueItem,
            resolved: true,
          };
        }
        return issueItem;
      });
      issueResolved = issues.issues;
    } else if (skip === 'one') {
      issue = {
        ...issue,
        resolved: true,
      };
      issueResolved = [{ ...issue }];
    }

    if (newValue !== '') {
      issue = {
        ...issue,
        newValue,
        resolved: true,
      };
      issueResolved = [{ ...issue }];
    }

    await resolveIssue({
      variables: {
        crossingId,
        currentIssue,
        issues: [
          ...issueResolved,
        ],
        currentFile,
        nodeId,
      },
      context: { clientName: 'globalization' },
    }).then((res) => {
      const nodeModels = {
        ...res.data.resolveIssue as unknown as NodeModels,
      };

      setNodes([nodeModels]);
      nextIssue();
    });
  };

  const handleSubmit = async ({ skip = '', type = '' }: Modify) => {
    await modifyIssue({
      newValue: userInputText ?? '',
      skip,
      type,
    });
    setUserInputText('');
  };

  const handleFixTxt = () => {
    nodesTemp.forEach(async () => {
      await replaceFile({
        variables: {
          crossingId,
          currentFile,
          nodeId,
        },
        context: { clientName: 'globalization' },
      }).then((res) => {
        const nodeModels = {
          ...res.data.replaceFile as unknown as NodeModels,
        };

        setNodes([nodeModels]);
        onClose();
      });
    });
  };

  const fileErrors = fileIssues.filter((fileIssue: Issues) => fileIssue.type === 'error' && !fileIssue.resolved);
  const fileWarnings = fileIssues.filter((fileIssue: Issues) => fileIssue.type === 'warning' && !fileIssue.resolved);
  const fileInfo = fileIssues.filter((fileIssue: Issues) => fileIssue.type === 'information' && !fileIssue.resolved);
  const allIssuesAreResolved = fileIssues.every((fileIssue: Issues) => fileIssue.resolved);

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="lg"
      onClose={onClose}
    >
      <DialogTitle>Corrector De Errores</DialogTitle>
      <DialogContent>
        <Grid container>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={12}>
              <Typography>
                {allIssuesAreResolved ? 'El archivo esta corregido' : `Para enviar la operación necesitas corregir ${nodes.length} archivo(s) con error(es)`}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <LinearProgress variant="determinate" value={current} />
            </Grid>
            <Grid item xs={12} style={{ textAlign: 'right' }}>
              <Typography>
                {allIssuesAreResolved ? null : `Total de archivos corregidos: ${current} de ${nodes.length}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid container item xs={12} spacing={3}>
            <Grid item xs={1}>
              <NoteAlt sx={{ fontSize: 80 }} />
            </Grid>
            <Grid item xs={9}>
              <Typography style={{ color: allIssuesAreResolved ? 'green' : 'blue' }}>
                { allIssuesAreResolved ? 'Corregido' : 'Corrigiendo' }
              </Typography>
              <Typography>
                {name}
              </Typography>
              <Typography style={{ color: allIssuesAreResolved ? 'green' : 'red' }}>
                { allIssuesAreResolved ? <CheckIcon style={{ marginRight: 10 }} fontSize="small" /> : <ErrorOutlineIcon style={{ marginRight: 10 }} fontSize="small" /> }
                {
                  allIssuesAreResolved
                    ? 'Se han corregido todos los errores, advertencias e información'
                    : `Se detectaron ${fileErrors.length} error(es), ${fileWarnings.length} warning(s), ${fileInfo.length} information(s)`
                  }
              </Typography>
            </Grid>
            {allIssuesAreResolved ? null : (
              <Grid container direction="row" justifyContent="flex-end" item xs={2}>
                <IconButton
                  aria-label="back"
                  size="large"
                  disabled={validateAction(current - 1, nodes.length)}
                  onClick={() => {
                    setUserInputText('');
                    setCurrent(current - 1);
                  }}
                >
                  <ArrowCircleLeftSharpIcon fontSize="large" />
                </IconButton>
                <IconButton
                  aria-label="foward"
                  size="large"
                  disabled={validateAction(current + 1, nodes.length)}
                  onClick={() => {
                    setUserInputText('');
                    setCurrent(current + 1);
                  }}
                >
                  <ArrowCircleRightSharpIcon fontSize="large" />
                </IconButton>
              </Grid>
            )}
          </Grid>

          {!allIssuesAreResolved && (
            <Grid container item xs={12} spacing={2}>
              <Grid container item xs={12}>
                <Grid item xs={9} style={{ paddingTop: 10 }}>
                  <Typography variant="h6">
                    {`${translateType(issue?.type)} en sección ${issue?.section}, campo ${issue?.field}, linea ${issue?.line} ( ${issue?.message} )`}
                  </Typography>
                </Grid>
                <Grid container direction="row" justifyContent="flex-end" item xs={3}>
                  <IconButton
                    aria-label="back"
                    size="large"
                    disabled={validateAction(currentIssue - 1, fileIssues.length)}
                    onClick={() => {
                      setUserInputText('');
                      setCurrentIssue(currentIssue - 1);
                    }}
                  >
                    <ArrowCircleLeftSharpIcon fontSize="large" />
                  </IconButton>
                  <IconButton
                    aria-label="foward"
                    size="large"
                    disabled={validateAction(currentIssue + 1, fileIssues.length)}
                    onClick={() => {
                      setUserInputText('');
                      setCurrentIssue(currentIssue + 1);
                    }}
                  >
                    <ArrowCircleRightSharpIcon fontSize="large" />
                  </IconButton>
                </Grid>
              </Grid>
              <Grid
                container
                item
                direction="column"
                justifyContent="space-between"
                alignItems="space-between"
                lg={12}
                md={12}
                sm={12}
                xs={12}
              >
                <Box sx={{ width: '100%' }}>
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="space-between"
                    item
                    xs={12}
                    sx={{ width: '100%' }}
                  >
                    <Grid
                      item
                      container
                      direction="row"
                      justifyContent="space-between"
                      alignItems="space-between"
                      spacing={2}
                      lg={8}
                      md={8}
                      sm={8}
                      xs={8}
                    >
                      <Grid
                        item
                        lg={8}
                        md={8}
                        sm={8}
                        xs={8}
                      >
                        <FormControl fullWidth variant="standard">
                          <TextField
                            type="text"
                            fullWidth
                            id="newValue"
                            name="newValue"
                            autoFocus
                            value={userInputText}
                            label={issue?.newValue || issue?.value}
                            onChange={({ target }) => setUserInputText(target.value)}
                            disabled={issue?.resolved}
                          />
                          <FormHelperText id="component-helper-text">
                            {`Valor encontrado, ${issue?.type === 'error' ? 'es necesario modificar' : 'modificar en caso de ser necesario.'}`}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        lg={4}
                        md={4}
                        sm={4}
                        xs={4}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          style={{ padding: '1.1em' }}
                          onClick={() => {
                            handleSubmit({
                              newValue: userInputText.trim(),
                            });
                            setUserInputText('');
                          }}
                          disabled={issue?.resolved}
                        >
                          Corregir
                        </Button>
                      </Grid>
                    </Grid>

                    {
                        issue?.type === 'warning' && (
                          <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="space-between"
                            spacing={2}
                            item
                            lg={4}
                            md={4}
                            sm={4}
                            xs={4}
                            sx={{ pl: 2 }}
                          >
                            <Grid item xs>
                              <Button
                                fullWidth
                                variant="outlined"
                                style={{ padding: '1.1em' }}
                                onClick={() => {
                                  handleSubmit({
                                    skip: 'one',
                                    type: 'warning',
                                  });
                                  setUserInputText('');
                                }}
                                disabled={issue?.resolved}
                              >
                                Omitir Advertencia
                              </Button>
                            </Grid>
                            <Grid item xs>
                              <Button
                                fullWidth
                                variant="outlined"
                                style={{ padding: '1.1em' }}
                                onClick={() => {
                                  handleSubmit({
                                    skip: 'all',
                                    type: 'warning',
                                  });
                                  setUserInputText('');
                                }}
                                disabled={issue?.resolved}
                              >
                                Omitir Advertencias
                              </Button>
                            </Grid>
                          </Grid>
                        )
                      }
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" autoFocus onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="outlined" autoFocus onClick={handleFixTxt}>
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ErrorFixerComponent;
