/* eslint-disable sonarjs/cognitive-complexity */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { FileDropZone, FileData, NodeModels } from '@gsuite/typings/files';

import { getUserSession } from '@gsuite/shared/contexts/AuthContext';
import ButtonLoading from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import Conditional from '@gsuite/ui/Conditional';
import { useTheme } from '@mui/material/styles';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { isBoolean, get } from 'lodash';
import { useCrossing } from '@gsuite/shared/contexts';
import { Panel } from '@gsuite/shared/components/panel';
import loadable from '@loadable/component';
import CachedIcon from '@mui/icons-material/Cached';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import LabelIcon from '@mui/icons-material/Label';
import LayersClearIcon from '@mui/icons-material/LayersClear';
import { useValidateFiles } from '@gsuite/shared/services/cruces';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useUpdateStatusCruce } from '@gsuite/shared/services/cruces/cruce-update';
import { useUpdateCruceHistory } from '@gsuite/shared/services/cruces/update-history';
import { uploadFiles } from '@gsuite/shared/lib/uploadFile';
import {
  PROFORMA_AUTHORIZATION_STATUS,
  DOCUMENTS_PROCESS_STATUS,
  REQUESTED_OPERATION_STATUS,
  DOCUMENTS_DELIVERED_STATUS,
  READY_DOCUMENTS_STATUS,
  PAID_DOCUMENTS_STATUS,
} from '@gsuite/shared/seeders/status';
import { downloadZip } from '../services/downloadZip';
import { useAssignUser } from '../services/assign-user';
import { useSendCruce } from '../services/sendCrossing';
import TreeList from './TreeList';
import useCruce from '../hooks/useCruce';
import { useCruceDetail } from '../services/cruce-detail';
import { useSubCruceDetail } from '../services/crossing-detail-sub';
import { useUpdateCruce } from '../services/cruce-update';
import { useValidateTxT, ValidateTxT, useUpdateTxT } from '../services/update-txt.files';
import { NewData } from './DialogValidate';
import { MaritimeBanner } from './MaritimeBanner';

type Params = {
  id: string;
};

const SendDocumentsDrawer = loadable(() => import('./SendDocumentsDrawer'), { fallback: <p> </p> });
const OfficeConfirmation = loadable(() => import('./OfficeConfirmation'), { fallback: <p> </p> });
const FilesMenu = loadable(() => import('./AddFilesMenu'), { fallback: <p> </p> });
const DialogValidate = loadable(() => import('./DialogValidate'), { fallback: <p> </p> });
const CancelCruceModal = loadable(() => import('./forms/cancelCruce'), { fallback: <p> </p> });
const ReasonDelay = loadable(() => import('./forms/ReasonDelay'), { fallback: <p> </p> });

export default function CruceDetail() {
  const [loading, setLoading] = useState(false);
  const [dialogData, setDialogData] = useState<ValidateTxT>();
  const [sendDocumentsDrawerIsOpen, setSendDocumentsDrawerIsOpen] = useState(false);
  const { id } = useParams<keyof Params>() as Params;
  const navigate = useNavigate();
  const { updateHistory } = useUpdateCruceHistory();
  const { data, refetch } = useCruceDetail(id);
  const [validatePedimento] = useValidateFiles();
  const {
    files,
    setFiles,
    tree,
    externalNode,
    setExternalNode,
    setTree,
    handleDropTree,
    openDialog,
    addValidateTxt,
    setOpenDialog,
    t,
    dispatchNodes,
    setDispatchNodes,
    createNodes,
    getValidateTxt,
    getTags,
    removeNodesDeleted,
    getTxtIssues,
    issuesFile,
  } = useCruce();
  const [assignUser] = useAssignUser();
  const { updateCrossing } = useUpdateCruce();
  const {
    successMessage, errorMessage, showSnackMessage, infoMessage,
  } = useSnackNotification();
  const { updateStatusCrossing } = useUpdateStatusCruce();
  const { sendCrossing, loading: loadingSend } = useSendCruce();
  const [openHistory, setOpenHistory] = useState(false);
  const [checkCrossing] = useValidateTxT();
  const [updateTxT] = useUpdateTxT();
  const theme = useTheme();
  const { crossing, setCrossing } = useCrossing();
  useSubCruceDetail(id, setCrossing);
  const value = data?.getCrossing;
  const [openBannerDrawer, setOpenBannerDrawer] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [optionsAnchorEl, setOptionsAnchorEl] = useState<null | HTMLElement>(null);
  const [openCancelCruceModal, setOpenCancelCruceModal] = useState(false);
  const open = !!anchorEl;
  const handleOpenBannerDrawer = () => {
    refetch();
    setOpenBannerDrawer(!openBannerDrawer);
  };
  const allIssues = tree.reduce((acc, node) => {
    if (!node.data?.issues) return acc;
    const { informations = 0, warnings = 0, errors = 0 } = node.data?.issues || {};
    if (node.data.ext === 'pdf') return acc;
    return {
      information: acc.information + informations,
      warning: acc.warning + warnings,
      error: acc.error + errors,
    };
  }, { information: 0, warning: 0, error: 0 });

  const disabledSendDarwin = () => {
    if (crossing?.sentDarwin) return true;
    if (tree.length > 0 && allIssues.error > 0) return true;

    if (crossing?.isWithoutTxtFlow) {
      const hasFilesDigitalized = externalNode
        .some((file: NodeModels) => file?.data?.firstDigitized);
      const hasFilesWithInvoiceTag = externalNode.some((file: NodeModels) => file?.data?.tags?.includes('Factura'));
      if (!hasFilesDigitalized && !hasFilesWithInvoiceTag) return true;
    }
    return false;
  };

  const handleSendDocumentsDrawerClose = () => setSendDocumentsDrawerIsOpen(false);

  const handleSendDocumentsDrawerOpen = () => setSendDocumentsDrawerIsOpen(true);

  const handleFilesMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleOptionsMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOptionsAnchorEl(e.currentTarget);
  };
  const { _id: currentStatusId } = value?.status || {};

  useEffect(() => {
    if (value?.id) {
      setCrossing({ ...value });
      setExternalNode(value?.nodes.externalNode);
      setTree(value?.nodes.tree);
      setDispatchNodes(value?.nodes.dispatchFileNode || []);
    }
  }, [value?.id]);

  useEffect(() => {
    setExternalNode(value?.nodes.externalNode || []);
    setTree(value?.nodes.tree || []);
    setDispatchNodes(value?.nodes.dispatchFileNode || []);
  }, [value?.nodes?.externalNode, value?.nodes?.tree, value?.nodes?.dispatchFileNode]);

  useEffect(() => {
    setTree(crossing?.nodes?.tree || []);
    setExternalNode(crossing?.nodes?.externalNode || []);
    setDispatchNodes(dispatchNodes || []);
  }, [crossing, setDispatchNodes, setExternalNode, setTree]);

  useEffect(() => {
    setTree(crossing?.nodes?.tree || []);
    setDispatchNodes(crossing?.nodes?.dispatchFileNode || []);
  }, [crossing?.nodes?.tree, crossing?.nodes?.dispatchFileNode]);

  useEffect(() => {
    if (value) setCrossing({ ...value });
  }, [value]);

  useEffect(() => {
    if (crossing?.id !== '') {
      setCrossing({
        ...crossing,
        nodes: {
          ...crossing?.nodes,
          tree,
          externalNode,
          dispatchFileNode: dispatchNodes,
        },
      });
    }
  }, [externalNode.length, tree.length, dispatchNodes.length]);

  // toda la logica de subir, etiquetar y separar archivos se mandara al back.
  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    const newNodes = async () => {
      const formValues = {
        type: crossing?.type,
        aduana: crossing?.aduana,
        patente: crossing?.patente,
        clientNumber: crossing?.clientNumber,
      };

      const { nodes, externalNodes } = await createNodes(files, tree, externalNode, formValues);
      const validation = getValidateTxt(
        nodes,
        formValues.aduana ?? '',
        formValues.patente ?? '',
        formValues.clientNumber ?? '',
        formValues?.type ?? '',
      );
      const { data: fileValidate } = await validatePedimento({
        variables: {
          validateFiles: validation,
        },
      });

      const { validatePedimento: arrayValidate } = fileValidate;
      const nodesValidateDarwin = arrayValidate
        .filter((node: any) => node.data);
      const { nodesValidate, orphanedNodes } = addValidateTxt(nodesValidateDarwin, nodes);
      if ((!nodesValidate || nodesValidate.length === 0) && externalNodes.length === 0) {
        setTree([]);
        setLoading(false);
        return;
      }
      const { nodes: cleanNodes } = removeNodesDeleted(nodesValidate);
      const { nodesTags, externalNodesTags } = await getTags(cleanNodes, externalNodes);

      const txtFiles = nodesValidate.filter((node: any) => node.data && node.data.ext === 'txt');
      const operationType = crossing?.type === 'Importacion' ? 1 : 2;
      const response = await getTxtIssues(crossing?.clientNumber ?? '', operationType, txtFiles);
      const { data: issues } = response;
      const issuesNodes = (issues?.with_issues && issuesFile(issues, nodesTags)) || nodesTags;
      const finalExternalNodes = [...externalNodesTags, ...orphanedNodes];
      const filesUpload = [...issuesNodes, ...finalExternalNodes]
        .filter((file) => file.data?.file) as unknown as FileDropZone[];
      const filesResponse = await uploadFiles(filesUpload) as unknown as FileData[];

      const newTree = [...issuesNodes];
      const newExternalNodes = [...finalExternalNodes];
      filesResponse.forEach(({ url, key }) => {
        const index = newTree.findIndex((node) => node.data?.name === key);
        if (index !== -1) {
          delete newTree[index].data?.extraData;
          newTree[index].data = {
            ...newTree[index].data,
            file: {
              url,
              key,
              name: newTree[index].data?.name ?? String(key),
            },
          };
        } else {
          const indexExternal = newExternalNodes.findIndex((node) => node.data?.name === key);
          if (indexExternal !== -1) {
            newExternalNodes[indexExternal].data = {
              ...newExternalNodes[indexExternal].data,
              file: {
                url,
                key,
                name: newTree[index]?.data?.name ?? String(key),
              },
            };
          }
        }
      });

      const { _id: idStatus } = crossing?.status || {};
      const correctStatus = [DOCUMENTS_PROCESS_STATUS, PROFORMA_AUTHORIZATION_STATUS].includes(idStatus ?? '');
      const canSetPedimentoPagado = correctStatus && [...newExternalNodes, ...newTree].some((e) => e?.data?.tags?.toLowerCase() === 'pedimento pagado');
      setTree(issuesNodes);
      setExternalNode(newExternalNodes);
      setCrossing({
        ...crossing,
        sentDarwin: false,
        ...(canSetPedimentoPagado && {
          status: {
            _id: PAID_DOCUMENTS_STATUS,
            name: 'Documentos pagados',
            color: '',
          },
        }),
        nodes: {
          tree: newTree,
          externalNode: newExternalNodes,
          dispatchFileNode: crossing?.nodes?.dispatchFileNode,
        },
      });
      await updateCrossing({
        variables: {
          crossing: {
            ...crossing,
            ...(canSetPedimentoPagado && {
              status: {
                _id: PAID_DOCUMENTS_STATUS,
                name: 'Documentos pagados',
                color: '',
              },
            }),
            sentDarwin: false,
            nodes: {
              tree: newTree,
              externalNode: newExternalNodes,
              dispatchFileNode: crossing?.nodes?.dispatchFileNode,
            },
          },
        },
        onCompleted: () => {
          successMessage('Archivo agregado correctamente');
          updateHistory({
            variables: {
              operation: {
                id: crossing?.id,
                action: canSetPedimentoPagado ? 'paid_documents' : 'update_file',
                files: files.map((myFile) => myFile.name || myFile.id),
                comments: '',
              },
            },
            context: { clientName: 'globalization' },
          });
          disabledSendDarwin();
        },
        context: { clientName: 'globalization' },
      }).catch(() => errorMessage('Ha ocurrido un error al subir el archivo'));
      setLoading(false);
    };
    if (files.length > 0) {
      setLoading(true);
      newNodes();
      setFiles([]);
    }
  }, [files]);

  const isDocumentDeliveredStatus = () => DOCUMENTS_DELIVERED_STATUS === currentStatusId;

  const cantSendDocuments = () => {
    if (READY_DOCUMENTS_STATUS === currentStatusId) return true;
    if (!value?.nodes?.dispatchFileNode) return true;
    const { dispatchFileNode } = value.nodes;
    if (dispatchFileNode.length === 0) {
      return true;
    }
    if (dispatchFileNode.length > 0) {
      return !dispatchFileNode.some((node) => node.data?.tags === 'DODA / PITA');
    }
    return !!(isDocumentDeliveredStatus());
  };

  const setUser = async () => {
    const getUser = await getUserSession().catch(() => {});
    await assignUser({
      variables: {
        crossingId: id,
        userId: getUser?.user?.id,
      },
    });
  };

  const handleSendDarwin = async (): Promise<void> => {
    const getUser = await getUserSession().catch(() => {});

    try {
      const response = await sendCrossing({
        variables: {
          id,
        },
        onCompleted: () => {
          if (getUser?.user?.id !== crossing?.user?.id) {
            setUser();
          }
        },
      });

      if (value?.nodes?.dispatchFileNode?.length === 0 || !value?.nodes?.dispatchFileNode) {
        if (getUser?.user?.id !== crossing?.user?.id) {
          await setUser();
        }
        await updateCrossing({
          variables: {
            crossing: {
              ...crossing,
              sentDarwin: true,
              nodes: {
                externalNode,
                tree,
                dispatchFileNode: [
                  {
                    id: 'dispatch-folder',
                    parent: '0',
                    text: 'Carpeta de despacho',
                    droppable: true,
                  },
                  {
                    id: 'dispatch-folder-dummy',
                    parent: 'dispatch-folder',
                    text: 'Dispatch File',
                    droppable: false,
                    data: {
                      name: 'Dispatch File',
                      tags: 'Agregar DODA / PITA',
                      ext: 'pdf',
                      file: {
                        url: '',
                        key: '',
                        name: '',
                      },
                    },
                  },
                ],
              },
            },
          },
          context: { clientName: 'globalization' },
        }).catch(() => {});
      }
      showSnackMessage(
        response?.data?.sendCrossing?.message || '',
        response?.data?.sendCrossing?.error ? 'error' : 'success',
        {
          vertical: 'top',
          horizontal: 'right',
        },
        2000,
        () => {
          if (!response?.data?.sendCrossing?.error) {
            navigate('/c/cruces');
          }
        },
      );
    } catch (error) {
      errorMessage(t<string>('cruces.an_error'));
    }
  };

  const handleSubmit = async () => {
    if (crossing?.isWithoutTxtFlow) {
      await handleSendDarwin();
      refetch();
      return;
    }
    const { data: response } = await checkCrossing({
      variables: {
        crossingId: id,
      },
    });
    const validateTxT = response?.checkCrossing;
    if (validateTxT?.isValid) {
      await handleSendDarwin();
      refetch();
    } else {
      setDialogData(validateTxT);
    }
  };

  const handleCloseDialog = () => {
    setDialogData({
      isValid: true,
      plates: [],
      economic: [],
      country: [],
    });
  };

  const handleUpdateTxtFiles = async (newData: NewData) => {
    const user = await getUserSession().catch(() => {});
    try {
      await updateTxT({
        variables: {
          data: {
            ...newData,
            id,
          },
        },
      });
      handleCloseDialog();
      await handleSendDarwin();
      if (user?.id !== crossing?.user?.id) {
        setUser();
      }
      refetch();
    } catch (error) {
      errorMessage(t<string>('cruces.error_update_txt_file'));
    }
  };

  const handleUpdateCrossing = async (): Promise<void> => {
    const getUser = await getUserSession().catch(() => {});
    try {
      if (getUser?.user?.id !== crossing?.user?.id) {
        await setUser();
      }
      await updateCrossing({
        variables: {
          crossing: {
            ...crossing,
            nodes: {
              externalNode,
              tree,
              dispatchFileNode: dispatchNodes ?? [],
            },
          },
        },
        context: { clientName: 'globalization' },
      });
      refetch();
      successMessage(t<string>('cruces.crossing_has_updated'));
    } catch (error) {
      errorMessage(t<string>('cruces.an_error_update'));
    }
  };

  const handleSendDocumentsMaritimeExpo = async (): Promise<void> => {
    try {
      await updateStatusCrossing({
        variables: { id: value?.id, status: DOCUMENTS_DELIVERED_STATUS },
        context: { clientName: 'globalization' },
      })
        .then(() => {
          successMessage(t<string>('cruces.onSuccess.deliveredDocuments'));
          refetch();
        });
    } catch (error) {
      console.log(error);
      errorMessage(t<string>('cruces.an_error'));
    }
  };

  const downloadFilesZip = async () => {
    setLoading(true);
    infoMessage('Descargando archivos...');
    try {
      const filesResponse = await downloadZip(id);
      if (filesResponse && filesResponse.size > 0) {
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(new Blob([filesResponse]));
        link.href = url;
        link.setAttribute('download', `${value?.number}.zip`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setLoading(false);
        return successMessage(t<string>('cruces.download_success'));
      }
      return successMessage(t<string>('cruces.send_file_to_email'));
    } catch (error) {
      return errorMessage(t<string>('cruces.download_error'));
    } finally {
      setLoading(false);
    }
  };

  const options = [
    {
      icon: <CachedIcon />,
      onClick: () => refetch(),
      label: 'Actualizar',
    },
    {
      icon: <FileDownloadIcon />,
      onClick: downloadFilesZip,
      label: 'Descargar archivos',
    },
    {
      icon: <LabelIcon />,
      onClick: () => null,
      label: '',
    },
    {
      icon: <LayersClearIcon />,
      onClick: () => null,
      label: '',
    },
    {
      icon: <MoreHorizIcon />,
      onClick: handleOptionsMenu,
      label: 'Mas opciones',
    },
  ];

  const availableCancelationStatus = [
    PROFORMA_AUTHORIZATION_STATUS,
    DOCUMENTS_PROCESS_STATUS,
    REQUESTED_OPERATION_STATUS,
  ];

  return (
    <>
      {sendDocumentsDrawerIsOpen && (
        <SendDocumentsDrawer
          open={sendDocumentsDrawerIsOpen}
          onClose={handleSendDocumentsDrawerClose}
          crossingId={crossing?.id ?? ''}
        />
      )}
      <Paper elevation={20}>
        {value && (
          <>
            <Grid
              container
              direction="row"
              padding={1}
            >
              <Stack spacing={5} sx={{ marginLeft: '1%' }} direction="row">
                <Typography color="#3A8FE8" variant="h6" component="div" gutterBottom>
                  {t<string>('cruces.operation')}
                  {' '}
                  {value?.number}
                </Typography>
                <Typography variant="h6" component="div" gutterBottom>
                  {value?.type}
                </Typography>
                <Typography variant="h6" component="div" gutterBottom>
                  {t<string>('cruces.trafficType')}
                  {' '}
                  {value?.trafficType}
                </Typography>
                <Typography variant="h6" component="div" gutterBottom>
                  {t<string>('cruces.patent')}
                  {' '}
                  {value?.patente}
                </Typography>
                <Typography variant="h6" component="div" gutterBottom>
                  {t<string>('cruces.customsOffice')}
                  {' '}
                  {value?.aduana}
                </Typography>
                {value?.client && value?.clientNumber && (
                  <Typography variant="h5" component="div" gutterBottom>
                    {`${value?.client} (${value?.clientNumber})`}
                  </Typography>
                )}
                <Button variant="text" onClick={() => setOpenHistory(true)} disabled={loading} sx={{ m: 2 }}>
                  <Typography variant="inherit">{t<string>('cruces.operation_monitor')}</Typography>
                </Button>
              </Stack>
              {
                crossing?.trafficType?.toLocaleLowerCase() === 'maritime' && (
                  <MaritimeBanner
                    crossing={crossing}
                    open={openBannerDrawer}
                    handleOpen={handleOpenBannerDrawer}
                  />
                )
              }
            </Grid>
            <Grid>
              <div style={{ height: '70vh', padding: '20px' }}>
                <TreeList
                  crossingId={value?.id}
                  tree={tree}
                  externalNode={externalNode}
                  dispatchFileNode={dispatchNodes ?? []}
                  handleDropTree={handleDropTree}
                  refetch={refetch}
                />
              </div>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                padding={2}
                spacing={1}
              >
                <Grid item xs={12}>
                  <Typography>
                    {
                      `
                        ${t<string>('cruces.files')}
                        (
                            ${allIssues.error} ${t<string>('cruces.mistakes')},
                            ${allIssues.warning} ${t<string>('cruces.warning')},
                            ${allIssues.information} ${t<string>('cruces.information')}
                        )
                      `
                    }
                  </Typography>
                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  md={4}
                  spacing={2}
                >
                  <Grid item spacing={2}>
                    {
                      options.map((option) => (
                        <IconButton
                          style={{ margin: 3, color: '#2F82E0' }}
                          onClick={option.onClick}
                          key={option.label}
                          aria-label={option.label}
                        >
                          {option.icon}
                        </IconButton>
                      ))
                    }
                    <Menu
                      id="simple-menu"
                      anchorEl={optionsAnchorEl}
                      keepMounted
                      open={Boolean(optionsAnchorEl)}
                      onClose={() => setOptionsAnchorEl(null)}
                    >
                      <MenuItem
                        onClick={() => {
                          setOptionsAnchorEl(null);
                          setOpenCancelCruceModal(true);
                        }}
                        style={{ color: '#2F82E0' }}
                        key="cancelOperation"
                        value="Cancelar Operación"
                        disabled={
                          !availableCancelationStatus.includes(
                            get(value, 'status._id', ''),
                          )
                        }
                      >
                        <HighlightOffIcon style={{ fontSize: 12, marginRight: 5 }} />
                        Cancelar Operación
                      </MenuItem>
                    </Menu>
                  </Grid>
                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  md={8}
                  direction="row"
                  justifyContent="flex-end"
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleFilesMenu}
                      aria-controls={open ? 'demo-positioned-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      size="small"
                      disabled={isDocumentDeliveredStatus()}
                    >
                      {t<string>('cruces.add_file')}
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={handleUpdateCrossing}
                      size="small"
                      disabled={isDocumentDeliveredStatus()}
                    >
                      <Typography variant="inherit">{t<string>('cruces.update_crossing')}</Typography>
                    </Button>
                  </Grid>
                  <Grid item>
                    <ButtonLoading
                      variant="outlined"
                      onClick={handleSubmit}
                      disabled={disabledSendDarwin() || isDocumentDeliveredStatus()}
                      loading={loadingSend}
                      size="small"
                    >
                      <Typography variant="inherit">{t<string>('cruces.send_to_darwin')}</Typography>
                    </ButtonLoading>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        if (get(crossing, 'trafficType', '') === 'maritime') {
                          if (get(crossing, 'type', '')?.toLowerCase() === 'exportacion') {
                            handleSendDocumentsMaritimeExpo();
                            return;
                          }
                          handleOpenBannerDrawer();
                          return;
                        }
                        handleSendDocumentsDrawerOpen();
                      }}
                      disabled={cantSendDocuments()}
                      size="small"
                    >
                      <Typography variant="inherit">Enviar documentos</Typography>
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Conditional
                loadable={openDialog}
                initialComponent={null}
              >
                <OfficeConfirmation
                  crossingId={crossing?.id ?? ''}
                  open={openDialog}
                  setOpen={setOpenDialog}
                />
              </Conditional>
            </Grid>
            <Panel
              nodes={crossing?.nodes}
              history={crossing?.history || []}
              openHistory={openHistory}
              setOpenHistory={setOpenHistory}
            />
          </>
        )}
        <FilesMenu
          refetch={refetch}
          setAnchorEl={setAnchorEl}
          open={open}
          anchorEl={anchorEl}
          theme={theme}
        />
        <DialogValidate
          open={isBoolean(dialogData?.isValid) ? !dialogData?.isValid : false}
          handleConfirm={handleUpdateTxtFiles}
          handleCloseDialog={handleCloseDialog}
          plates={dialogData?.plates ?? []}
          economics={dialogData?.economic ?? []}
          countrys={dialogData?.country ?? []}
        />
        <CancelCruceModal
          open={openCancelCruceModal}
          handleVisibility={setOpenCancelCruceModal}
          title={`${t<string>('cruces.operation')} ${value?.number}`}
          crossingId={id}
          t={t}
        />
        <ReasonDelay
          statusHistory={data?.getCrossing?.statusHistory ?? []}
          crossingId={id}
          refetch={refetch}
        />
      </Paper>
    </>
  );
}
