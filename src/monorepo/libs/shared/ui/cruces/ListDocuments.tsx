import React, {
  useState,
  useEffect,
} from 'react';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { useTranslation } from 'react-i18next';
import printjs from 'print-js';
import get from 'lodash/get';
import {
  Button,
  Card,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Grid,
} from '@mui/material';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import PrintIcon from '@mui/icons-material/Print';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { DRAFT_OPERATION_STATUS } from '@gsuite/shared/seeders';
import { downloadFilesZipByKeys } from '@gsuite/shared/services/downloadfilesZipByKeys';
import { AuthorizeProforma } from '@gsuite/shared/ui/cruces';
import {
  ExpandLess,
  ExpandMore,
  Delete as DeleteIcon,
  DriveFileRenameOutline as DriveFileRenameOutlineIcon,
  DragIndicator as DragIndicatorIcon,
  Label as LabelIcon,
} from '@mui/icons-material';
import { DialogComponent, useDialog } from '@gsuite/shared/ui';
import CloseIcon from '@mui/icons-material/Close';
import { customerCanDeleteFiles } from '@gsuite/shared/utils';
import { useUpdateCruce } from '@gsuite/shared/services/cruces/cruce-update';
import { useUpdateCruceHistory } from '@gsuite/shared/services/cruces/update-history';
import { NodeModels, FileWithIssue } from '@gsuite/typings/files';
import { useCrossing } from '@gsuite/shared/contexts/cruces/CrossingContext';
import ModalErrors from './ModalErrors';
import TypeIcon from './TypeIcon';
import ErrorFixerComponent from './ErrorFixer';

type Props = {
  crossingId?: string;
  node: NodeModels;
  isOpen: boolean;
  onToggle: (node: NodeModels['id']) => void;
  depth: number;
  isCostumer?: boolean;
};

type OptionsProps = {
  node: NodeModels,
  toggleErrorDialog: () => void,
  typeFile: string,
};

type Tag = {
  color: string,
  type: string,
  textContent: string,
};

const getColor = (isValid: boolean): string => (isValid ? '#65E340' : '#FF0800');

const getAuthorizationColor = (isPending: boolean): string => (isPending ? '#FFA500' : '#007FFF');

const tagColors = {
  errors: '#FF0000',
  warnings: '#FFA500',
  informations: '#007FFF',
  validate: '#65E340',
};

function AuthorizationTag({
  node,
  isCostumer = false,
}: {
  node: NodeModels,
  isCostumer?: boolean,
}) {
  const { data } = node;
  const nodeIsProforma = data?.tags?.toLowerCase().includes('proforma');
  const hasPendingAuthorization = data?.pendingAuthorization ?? true;
  const [openDialog, closeDialog] = useDialog();
  const { crossing } = useCrossing();
  const { t } = useTranslation();
  if (!nodeIsProforma) return null;
  const hasBeenUnauthorized = !data?.pendingAuthorization && data?.unauthorized;
  const targetNode = crossing?.isWithoutTxtFlow
    ? crossing?.nodes?.externalNode?.find((e) => e?.data?.tags?.toLowerCase() === 'proforma')
    : crossing?.nodes?.tree?.find((e) => e?.data?.tags?.toLowerCase() === 'proforma');

  if (hasBeenUnauthorized) {
    return (
      <Button
        variant="outlined"
        size="small"
        sx={{
          color: tagColors.errors,
          borderColor: tagColors.errors,
          p: 0.2,
          fontSize: 8,
          pointerEvents: 'none',
        }}
      >
        {t('cruces.history.unauthorize_proforma')}
      </Button>
    );
  }

  return (
    <Button
      variant="outlined"
      size="small"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...(
        isCostumer && hasPendingAuthorization
          ? {
            onClick: () => openDialog({
              children: (
                (
                  <AuthorizeProforma
                    node={targetNode as NodeModels}
                    crossingId={crossing?.id as string}
                    fileId={targetNode?.id as string}
                    fileName={targetNode?.data?.file?.name as string}
                    fileUrl={targetNode?.data?.file?.url as string}
                    onClose={closeDialog}
                  />
                )
              ),
            }),
          } : {}
      )}
      style={{
        ...(!isCostumer && {
          pointerEvents: 'none',
        }),
      }}
      sx={{
        color: getAuthorizationColor(hasPendingAuthorization),
        borderColor: getAuthorizationColor(hasPendingAuthorization),
        p: 0.2,
        fontSize: 8,
      }}
    >
      {hasPendingAuthorization ? 'Autorización Pendiente' : 'Proforma autorizada para pago'}
    </Button>
  );
}

export const getSizeIssueByType = (
  type: string,
  issues?: FileWithIssue,
) => {
  const size = issues?.issues.filter((i) => i.type === type && i.resolved !== true).length || 0;
  const textContent = `${size} ${type}`;
  return size > 0 ? `${textContent}s` : textContent;
};

const tagIssues = (toggleErrorDialog: () => void, issues?: FileWithIssue) => {
  const nodeArray: React.ReactNode[] = [];
  let issueInfoArray: Tag[] = [];
  if (issues) {
    issueInfoArray = [
      {
        color: tagColors.errors,
        type: 'errors',
        textContent: `${getSizeIssueByType('error', issues)}`,
      },
      {
        color: tagColors.warnings,
        type: 'warnings',
        textContent: `${getSizeIssueByType('warning', issues)}`,
      },
      {
        color: tagColors.informations,
        type: 'informations',
        textContent: `${getSizeIssueByType('information', issues)}`,
      },
    ];
  }

  issueInfoArray
    .filter((issue) => !issue.textContent.includes('0'))
    .forEach(({ color, type, textContent }, i) => {
      nodeArray.push(
        <Button
          key={`tag_${type}_${String(i)}`}
          variant="outlined"
          size="small"
          onClick={toggleErrorDialog}
          sx={{
            color,
            borderColor: color,
            p: 0.2,
            fontSize: 8,
          }}
        >
          {textContent}
        </Button>,
      );
    });
  return nodeArray;
};

interface DeleteFileProps {
  isOpen: boolean,
  handleOpen: (event: React.MouseEvent<HTMLElement>) => void,
  setIsOpen?: (isOpen: boolean) => void,
  anchor?: HTMLElement | null
  selectedNode: NodeModels,
}

interface DeleteModalProps {
  key: string,
  isOpen: boolean,
  setIsOpen?: (isOpen: boolean) => void,
  selectedNode: NodeModels,
  relatedFiles: NodeModels[]
  setRelatedFiles: (node: NodeModels[]) => void,
}

function FilesToDelete({ filesToDelete }: { filesToDelete: NodeModels[] }) {
  return (
    <Stack direction="row" spacing={1} key="filesT" sx={{ margin: '2%' }}>
      {
        filesToDelete.map((file, i) => (
          <>
            <TypeIcon key={`type-icon-${String(i)}`} icon={file.data?.ext} url={file.data?.file?.url} />
            <Stack key={`stack-${String(i)}`} direction="column">
              {file.data?.name}
            </Stack>
          </>
        ))
      }
    </Stack>
  );
}

function DeleteFileModal({
  isOpen, setIsOpen = () => false, selectedNode, relatedFiles, setRelatedFiles, key,
}: DeleteModalProps) {
  const { errorMessage, successMessage } = useSnackNotification();
  const { t } = useTranslation();
  const { crossing, setCrossing } = useCrossing();
  const { _id: idStatus } = crossing?.status ?? {};
  const { updateCrossing } = useUpdateCruce();
  const { updateHistory } = useUpdateCruceHistory();
  const generateNewTree = (
    allTXTWereDeleted: boolean,
    pedimento: string | number,
  ) => (allTXTWereDeleted
    ? crossing?.nodes?.tree?.filter(
      (n) => {
        if (n.parent === '0') {
          if (n.id !== pedimento) return n;
          return null;
        }
        if (n.text !== selectedNode.text) return n;
        return null;
      },
    ) || []
    : crossing?.nodes?.tree?.filter((n) => n.text !== selectedNode.text) || []);

  const handleDelete = async () => {
    const pedimento = relatedFiles[0].parent;

    const totalTxt = crossing?.nodes?.tree?.filter((e) => e.data?.ext === 'txt' && e.parent === pedimento).length || 0;
    const quantityTXTToDelete = relatedFiles.filter((e: NodeModels) => e?.data?.ext === 'txt').length || 0;
    const allTXTWereDeleted = (totalTxt - quantityTXTToDelete) === 0;
    const newTree : NodeModels[] = generateNewTree(allTXTWereDeleted, pedimento);
    const orphans = newTree.filter((n) => n.parent === pedimento) || [];
    const newCrossing = {
      ...crossing,
      nodes: {
        ...crossing?.nodes,
        tree: [...newTree],
        ...(allTXTWereDeleted && { externalNode: [...crossing?.nodes?.externalNode || [], ...orphans.map((n) => ({ ...n, parent: '0' }))] }),
      },
    };

    if (pedimento === 'general-folder') {
      const filtered = crossing?.nodes?.externalNode?.filter((f) => f.text
        !== relatedFiles[0].text);
      if (filtered) {
        newCrossing.nodes.externalNode = [...filtered];
      }
    }

    delete newCrossing.user;
    if (!crossing?.id) {
      setCrossing(newCrossing);
      setIsOpen(false);
      return;
    }

    await updateCrossing({
      variables: {
        crossing: {
          ...newCrossing,
        },
      },
      context: { clientName: 'globalization' },
    }).then(async () => {
      const { data } = await updateHistory({
        variables: {
          operation: {
            id: crossing?.id,
            action: 'deleted_file',
            files: relatedFiles.map((file) => `${file.text}.${file.data?.ext}` || ''),
          },
        },
        context: { clientName: 'globalization' },
      });

      setCrossing({
        ...newCrossing,
        history: crossing?.history
          ? [...crossing.history, data.updateCrossingHistory.history]
          : [data?.updateHistory],
      });
      successMessage('Archivo eliminado(s) con exito');
      setCrossing(newCrossing);
      setIsOpen(false);
    })
      .catch(() => {
        errorMessage('Ocurrio un error al eliminar el archivo');
        setIsOpen(false);
      });
  };

  useEffect(() => {
    const getRelatedFiles = () => {
      const filesToDelete = crossing?.nodes?.tree?.filter(
        (n) => n.text === selectedNode.text,
      );
      setRelatedFiles(filesToDelete || []);
    };
    getRelatedFiles();
  }, [crossing?.nodes?.tree, selectedNode]);

  return (
    <DialogComponent
      open={isOpen}
      handleClose={() => setIsOpen(false)}
      title={t('cruces.confirm_delete_file')}
      body={idStatus === DRAFT_OPERATION_STATUS ? t('cruces.confirm_delete_file_text_draft') : t('cruces.confirm_delete_file_text')}
      doubleCheck
      doubleCheckText={t('cruces.confirm_want_to_delete')}
      maxWidth="sm"
      handleConfirm={handleDelete}
      okText={t('cruces.delete_documents')}
      cancelText={t('cancel')}
    >
      <FilesToDelete key={key || 'no-name'} filesToDelete={relatedFiles} />
    </DialogComponent>
  );
}

function DeleteFile({
  isOpen, anchor = null, handleOpen, selectedNode,
}: DeleteFileProps) {
  const canBeOpen = isOpen && Boolean(anchor);
  const id = canBeOpen ? 'transition-popper' : undefined;
  const { crossing, setCrossing } = useCrossing();
  const handleDelete = (click: React.MouseEvent<HTMLElement>) => {
    setCrossing({
      ...crossing,
      nodes: {
        ...crossing?.nodes,
        tree: crossing?.nodes?.tree?.filter((n) => n.id !== selectedNode.id),
      },
    });

    handleOpen(click);
  };
  return (
    <Popper id={id} open={isOpen} anchorEl={anchor} transition>
      {({ TransitionProps }) => (
        // eslint-disable-next-line react/jsx-props-no-spreading
        <Fade {...TransitionProps} timeout={350}>
          <Box sx={{ p: 1, bgcolor: 'background.paper' }}>
            <Stack direction="row" spacing={1}>
              <Button
                sx={{
                  p: 0.2,
                  fontSize: 12,
                }}
                variant="outlined"
                onClick={handleOpen}
              >
                Cancelar

              </Button>
              <Button
                sx={{
                  p: 0.2,
                  fontSize: 12,
                }}
                variant="contained"
                onClick={handleDelete}
              >
                Eliminar
              </Button>
            </Stack>
          </Box>
        </Fade>
      )}
    </Popper>
  );
}

function OptionsComponent({ node, toggleErrorDialog, typeFile }: OptionsProps) {
  const { data } = node;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isOpen, setIsOpen] = useState(false);
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const handleToggleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
    setIsOpen((previousOpen) => !previousOpen);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const hasIssues = data?.issues?.issues?.length;

  return (
    <Stack direction="row">
      <DeleteFile
        isOpen={isOpen}
        handleOpen={handleToggleClick}
        anchor={anchor}
        selectedNode={node}
      />
      <IconButton
        aria-label="edit"
        size="small"
        onClick={handleClick}
      >
        <DriveFileRenameOutlineIcon fontSize="small" />
      </IconButton>
      <Menu
        id={`menu-${node.id}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {typeFile === 'txt' && (
          <MenuItem
            onClick={() => toggleErrorDialog()}
            disabled={!hasIssues}
          >
            Corregir
          </MenuItem>
        )}
      </Menu>
      <IconButton aria-label="edit" size="small" onClick={handleToggleClick}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}

interface OptionsComponentCustomerProps {
  node: NodeModels;
  toggleErrorDialog?: () => void;
  errorVisibility?: boolean;
}

function OptionsComponentCustomer({
  node,
  toggleErrorDialog = () => {},
  errorVisibility = false,
}: OptionsComponentCustomerProps) {
  const { crossing, isCustomerFlow } = useCrossing();
  const { _id: currentStatus } = crossing?.status || {};
  const canDelete = customerCanDeleteFiles(currentStatus || '');
  const [isOpen, setIsOpen] = useState(false);
  const [relatedFiles, setRelatedFiles] = useState<NodeModels[]>([]);

  const handleToggleClick = () => {
    setIsOpen((previousOpen) => !previousOpen);
    setRelatedFiles([node] || []);
  };
  return (
    <Stack direction="row">
      {(isCustomerFlow && canDelete) || !crossing?.status ? (
        <DeleteFileModal
          key="name"
          isOpen={isOpen}
          selectedNode={node}
          setIsOpen={setIsOpen}
          relatedFiles={relatedFiles}
          setRelatedFiles={setRelatedFiles}
        />
      ) : null}
      <IconButton
        aria-label="edit"
        size="small"
        onClick={handleToggleClick}
      >
        { canDelete || !crossing?.status ? <CloseIcon fontSize="small" /> : null }
      </IconButton>
      <ModalErrors
        key="name"
        node={node}
        open={errorVisibility}
        onClose={toggleErrorDialog}
      />
    </Stack>
  );
}

interface TXTFileProps {
  node: NodeModels;
  setErrorVisibility: (value: boolean) => void;
  errorVisibility: boolean;
  crossingId: string;
  depth: number;
}

function TXTFile({
  node,
  setErrorVisibility,
  errorVisibility,
  crossingId,
  depth,
} : TXTFileProps) {
  const { data, id } = node;
  const txtValidation = data?.validate;
  const { isCustomerFlow } = useCrossing();
  const onCloseErrorFixer = () => {
    setErrorVisibility(false);
  };
  return (
    <Card
      sx={{
        width: '100%',
        minHeight: 80,
        maxHeight: 300,
        borderRadius: 1,
        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
        marginBottom: 2,
        justifyContent: 'center',
      }}
      key={id}
      draggable={false}
    >
      <Grid
        container
        direction="row"
        spacing={1}
        justifyContent="flex-start"
        alignItems="center"
        style={{ padding: 20 }}
      >
        <Grid item xs={12} md={2}>
          <TypeIcon icon={data?.ext} url={data?.file?.url} />
        </Grid>
        <Grid container item xs={12} md={10} spacing={2}>
          <Grid item xs={12}>
            <ListItemText secondary={data?.name} />
          </Grid>
          <Grid container item xs={12} md={10}>
            <Grid item xs={12} md={11}>
              <Button
                variant="outlined"
                size="small"
                style={{ pointerEvents: 'none' }}
                sx={{
                  color: getColor(!!txtValidation),
                  borderColor: getColor(!!txtValidation),
                  p: 0.2,
                  fontSize: 8,
                }}
              >
                {txtValidation ? 'Validado' : 'No Validado'}
              </Button>
              {tagIssues(() => setErrorVisibility(!errorVisibility), data?.issues)}
            </Grid>
            <Grid item xs={12} md={1}>
              {
                    isCustomerFlow ? (
                      <OptionsComponentCustomer
                        node={node}
                        toggleErrorDialog={() => setErrorVisibility(!errorVisibility)}
                        errorVisibility={errorVisibility}
                      />
                    ) : (
                      <OptionsComponent
                        node={node}
                        toggleErrorDialog={() => setErrorVisibility(!errorVisibility)}
                        typeFile={data?.ext || 'txt'}
                      />
                    )
                  }
              {
                    !isCustomerFlow && (
                      <ErrorFixerComponent
                        open={errorVisibility}
                        crossingId={crossingId}
                        nodes={[node]}
                        currentFile={depth}
                        onClose={onCloseErrorFixer}
                      />
                    )
                  }
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}

export function ListDocuments({
  crossingId = '',
  node,
  isOpen,
  onToggle,
  depth,
  isCostumer = false,
}: Props) {
  const [errorVisibility, setErrorVisibility] = useState(false);
  const { successMessage, errorMessage } = useSnackNotification();
  const { t } = useTranslation();
  const [isDigitized, setDigitized] = useState(
    node.data?.digitized ? true : node?.data?.firstDigitized,
  );
  const { crossing, setCrossing, isCustomerFlow } = useCrossing();
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(node.id);
  };

  const handleDigitalized = () => {
    if (node.data?.digitized) return;
    setDigitized(!isDigitized);
    setCrossing({
      ...crossing,
      nodes: {
        ...crossing?.nodes,
        tree: crossing?.nodes?.tree?.map((n) => {
          if (n.id === node.id) {
            return {
              ...n,
              data: {
                ...n.data,
                firstDigitized: !n.data?.firstDigitized,
              },
            };
          }
          return n;
        }),
      },
    });
  };

  const handlePrintOrDownload = async (key: string, title: string, print = false) => {
    const newTitle: string = title.replace('.pdf', '');
    const filesResponse = await downloadFilesZipByKeys([key]);
    if (filesResponse && filesResponse.size > 0) {
      const url = window.URL.createObjectURL(filesResponse);

      if (print) return printjs(url);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${newTitle}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return successMessage(t('cruces.download_file'));
    }

    return errorMessage(t('cruces.download_error'));
  };

  if (node.data?.ext === 'txt') return <TXTFile node={node} setErrorVisibility={setErrorVisibility} errorVisibility={errorVisibility} crossingId={crossingId} depth={depth} />;

  if (node.droppable) {
    return (
      <ListItemButton
        onClick={handleToggle}
        sx={{ paddingInlineStart: depth * 24 }}
      >
        <ListItemIcon>
          <TypeIcon droppable={node.droppable || false} />
        </ListItemIcon>
        <ListItemText primary={node.text} />
        {isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
    );
  }

  return (
    <Card
      sx={{
        width: '100%',
        minHeight: 80,
        maxHeight: 300,
        borderRadius: 1,
        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
        marginBottom: 2,
        justifyContent: 'center',
      }}
      key={node.id}
    >
      <Grid
        container
        direction="row"
        spacing={2}
        sx={{
          padding: 2,
        }}
        justifyContent="flex-start"
        alignItems="center"
      >
        <Grid item xs={1}>
          <DragIndicatorIcon sx={{ width: 30, height: 30 }} />
        </Grid>
        <Grid item xs={2}>
          <TypeIcon icon={node.data?.ext} url={node.data?.file?.url} />
        </Grid>
        <Grid container item xs={12} md={8} spacing={1}>
          <Grid item xs={12}>
            <ListItemText secondary={node.data?.name} />
          </Grid>
          <Grid container item xs={12} md={12} direction="row">
            <Grid item xs={12} md={11}>
              {node.data?.tags && (
                <Button
                  startIcon={<LabelIcon />}
                  variant="outlined"
                  size="small"
                  style={{ pointerEvents: 'none' }}
                  sx={{
                    p: 0.2,
                    fontSize: 8,
                  }}
                >
                  {node.data.tags}
                </Button>
              )}
              {
                node.data?.ext === 'pdf' && node.parent !== 'dispatch-folder' ? (
                  <>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleDigitalized}
                      sx={{
                        color: getColor(!!isDigitized),
                        borderColor: getColor(!!isDigitized),
                        pr: 0.3,
                        pl: 0.3,
                        fontSize: 8,
                      }}
                    >
                      {isDigitized ? 'Digitalizado' : ' Sin digitalizar'}
                    </Button>
                    {
                      !isCustomerFlow ? (
                        <>
                          <IconButton
                            onClick={() => handlePrintOrDownload(get(node, 'data.file.key', ''), get(node, 'data.file.name', ''), true)}
                          >
                            <PrintIcon color="primary" />
                          </IconButton>
                          <IconButton
                            onClick={() => handlePrintOrDownload(get(node, 'data.file.key', ''), get(node, 'data.file.name', ''))}
                          >
                            <FileDownloadIcon color="primary" />
                          </IconButton>
                        </>
                      ) : null
                    }
                  </>
                ) : null
              }
              <AuthorizationTag
                node={node}
                isCostumer={isCostumer}
              />
            </Grid>
            <Grid item xs={12} md={1}>
              {
                isCustomerFlow ? (
                  <OptionsComponentCustomer
                    node={node}
                    toggleErrorDialog={() => 1}
                    errorVisibility={errorVisibility}
                  />
                ) : (
                  <OptionsComponent
                    node={node}
                    toggleErrorDialog={() => 1}
                    typeFile={node.data?.ext || 'pdf'}
                  />
                )
              }
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}

export default ListDocuments;
