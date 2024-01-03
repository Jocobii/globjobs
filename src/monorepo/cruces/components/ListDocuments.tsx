/* eslint-disable sonarjs/cognitive-complexity */
import React, { useState, useEffect } from 'react';
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
  Grid,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getUserSession } from '@gsuite/shared/contexts/AuthContext';
import {
  ExpandLess,
  ExpandMore,
  Delete as DeleteIcon,
  DriveFileRenameOutline as DriveFileRenameOutlineIcon,
  DragIndicator as DragIndicatorIcon,
  Label as LabelIcon,
} from '@mui/icons-material';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { DialogComponent } from '@gsuite/shared/ui';
import { useUpdateCruce } from '@gsuite/shared/services/cruces/cruce-update';
import { useUpdateCruceHistory } from '@gsuite/shared/services/cruces/update-history';
import { useCrossing } from '@gsuite/shared/contexts';
import { NodeModels, FileWithIssue } from '@gsuite/typings/files';
import { TFunctionType } from '@gsuite/typings/common';
import DodaPitaShortCut from './DodaPitaShortCut';
import { useAssignUser } from '../services/assign-user';
import ChangeTag from './ChangeTag';
import TypeIcon from './TypeIcon';
import { urlIntegration, openNewTab } from '../utils/func';
import ErrorFixerComponent from './ErrorFixer';
import { useCruceDetail } from '../services/cruce-detail';
import ModalIntegrationNumber from './ModalIntegrationNumber';

const onlyNumbers = /^[0-9]+$/;

const DISPATCH_FOLDER = 'dispatch-folder';

type Props = {
  crossingId?: string;
  node: NodeModels;
  isOpen: boolean;
  onToggle: (node: NodeModels['id']) => void;
  depth: number;
  refetch?: () => void;
};

type OptionsProps = {
  node: NodeModels,
  handleOption: (action: string) => void,
  typeFile: string,
};

interface DeleteModalProps {
  isOpen: boolean,
  setIsOpen?: (isOpen: boolean) => void,
  selectedNode: NodeModels,
  folderParent?: string;
}

type Tag = {
  color: string,
  type: string,
  textContent: string,
};

const getColor = (isValid: boolean): string => (isValid ? '#65E340' : '#FF0800');

const tagColors = {
  errors: '#FF0000',
  warnings: '#FFA500',
  informations: '#007FFF',
  validate: '#65E340',
};

function FilesToDelete({ filesToDelete }: { filesToDelete: NodeModels[] }) {
  return (
    <Stack direction="row" spacing={1} key="filesT" sx={{ margin: '2%' }}>
      {
        filesToDelete.map((file) => (
          <>
            <TypeIcon icon={file.data?.ext} url={file.data?.file?.url} />
            <Stack direction="column">
              {file.data?.name}
            </Stack>
          </>
        ))
      }
    </Stack>
  );
}

const openIntegration = (tag?: string, integrationNumber?: string) => {
  if (tag === 'DODA / PITA' && integrationNumber) {
    openNewTab(urlIntegration(integrationNumber));
  }
};

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

type Folders = {
  [key: string]: string;
};

type GlobalNodes = {
  [key: string]: NodeModels[];
};

function DeleteFileModal({
  isOpen, setIsOpen = () => false, selectedNode, folderParent = '',
}: DeleteModalProps) {
  const { successMessage, errorMessage } = useSnackNotification();
  const { t } = useTranslation();
  const { crossing, setCrossing } = useCrossing();
  const { updateCrossing } = useUpdateCruce();
  const { refetch } = useCruceDetail(crossing?.id as string);
  const [assignUser] = useAssignUser();
  const { updateHistory } = useUpdateCruceHistory();
  const [relatedFiles, setRelatedFiles] = useState<NodeModels[]>([selectedNode]);

  const folders: Folders = {
    'general-folder': 'externalNode',
    [DISPATCH_FOLDER]: 'dispatchNodes',
  };

  const originNode = folders[folderParent] || 'tree';
  const generalDispatchNodes: GlobalNodes = {
    dispatchNodes: crossing?.nodes?.dispatchFileNode || [],
    externalNode: crossing?.nodes?.externalNode || [],
    tree: crossing?.nodes?.tree || [],
  };
  const originNodes = generalDispatchNodes[originNode] || [];

  const deleteFromExternalOrDispatchNodes = async () => {
    const newNode = originNodes.filter((n: NodeModels) => n.text !== selectedNode.text);
    const nodeToUpdate = originNode === 'dispatchNodes' ? 'dispatchFileNode' : originNode;
    const newCrossing = {
      ...crossing,
      nodes: {
        ...crossing?.nodes,
        [nodeToUpdate]: [...newNode],
      },
    };

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
      successMessage('Archivo eliminado(s) con exito');
      setCrossing({
        ...newCrossing,
        history: data.updateCrossingHistory.history,
      });
      refetch();
      setIsOpen(false);
    });
  };
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
    if ([DISPATCH_FOLDER, 'general-folder'].includes(folderParent)) {
      await deleteFromExternalOrDispatchNodes();
      return;
    }
    const pedimento = relatedFiles[0].parent;
    const totalTxt = crossing?.nodes?.tree?.filter((e) => e.data?.ext === 'txt' && e.parent === pedimento).length || 0;
    const quantityTXTToDelete = relatedFiles.filter((e: NodeModels) => e?.data?.ext === 'txt').length || 0;
    const allTXTWereDeleted = (totalTxt - quantityTXTToDelete) === 0;

    const newTree = generateNewTree(allTXTWereDeleted, pedimento);

    const orphans = newTree.filter((n) => n.parent === pedimento) || [];

    const newCrossing = {
      ...crossing,
      nodes: {
        ...crossing?.nodes,
        tree: [...newTree],
        ...(allTXTWereDeleted && { externalNode: [...crossing?.nodes?.externalNode || [], ...orphans.map((n) => ({ ...n, parent: '0' }))] }),
      },
    };

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
      const getUser = await getUserSession();
      setCrossing({
        ...newCrossing,
        history: data.updateCrossingHistory.history,
      });
      if (getUser?.user?.id !== crossing?.user?.id) {
        assignUser({
          variables: {
            crossingId: crossing?.id,
            userId: getUser?.user?.id,
          },
        });
      }
      refetch();
      successMessage('Archivo eliminado(s) con exito');
      setIsOpen(false);
    })
      .catch(() => {
        errorMessage('Ocurrio un error al eliminar el archivo');
        setIsOpen(false);
      });
  };

  useEffect(() => {
    const getRelatedFiles = () => {
      const filesToDelete = originNodes.filter(
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
      body={t('cruces.confirm_delete_file_text')}
      doubleCheck
      doubleCheckText={t('cruces.confirm_want_to_delete')}
      maxWidth="sm"
      handleConfirm={handleDelete}
      okText={t('cruces.delete_documents')}
      cancelText={t('cancel')}
    >
      <FilesToDelete filesToDelete={relatedFiles} />
    </DialogComponent>
  );
}

function OptionsComponent({ node, handleOption, typeFile }: OptionsProps) {
  const { data } = node;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleClick = () => {
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
      <DeleteFileModal
        isOpen={isOpen}
        selectedNode={node}
        setIsOpen={setIsOpen}
        folderParent={node.parent.toString() || ''}
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
            onClick={() => handleOption('edit')}
            disabled={!hasIssues}
          >
            Corregir
          </MenuItem>
        )}
        <MenuItem
          onClick={() => handleOption('label')}
        >
          Etiquetar
        </MenuItem>
      </Menu>
      <IconButton
        aria-label="edit"
        size="small"
        onClick={handleToggleClick}
      >
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Stack>
  );
}

function AuthorizationTag({ node, t }:
{ node: NodeModels, t: TFunctionType }) {
  const { data } = node;
  const nodeIsProforma = data?.tags?.toLowerCase().includes('proforma');
  const nodeIsTaxes = data?.tags?.toLowerCase().includes('autorización de impuestos (us)');
  const hasBeenUnauthorized = !data?.pendingAuthorization && data?.unauthorized;
  const hasPendingAuthorization = data?.pendingAuthorization ?? true;
  const hasPendingPaymentAuthorization = data?.pendingPaymentAuthorization ?? false;
  const unauthorized = data?.unauthorized ?? false;

  const getAuthorizationColor = () => {
    if (unauthorized) return tagColors.errors;
    if (hasPendingAuthorization) return tagColors.warnings;
    if (hasPendingPaymentAuthorization) return tagColors.warnings;
    return tagColors.validate;
  };

  const proformaStatusTag = () => {
    if (unauthorized) return 'Autorización rechazada';
    if (hasPendingAuthorization) return 'Autorización pendiente';
    if (hasPendingPaymentAuthorization) return 'Autorización de pago pendiente';
    return 'Autorización aprobada';
  };

  if (hasBeenUnauthorized && !nodeIsTaxes) {
    return (
      <Button
        variant="outlined"
        size="small"
        sx={{
          color: tagColors.errors,
          borderColor: tagColors.errors,
          p: 0.2,
          fontSize: 8,
        }}
      >
        {t('cruces.history.unauthorize_proforma')}
      </Button>
    );
  }

  if (nodeIsProforma) {
    return (
      <Button
        variant="outlined"
        size="small"
        sx={{
          color: getAuthorizationColor(),
          borderColor: getAuthorizationColor(),
          p: 0.2,
          fontSize: 8,
        }}
      >
        {proformaStatusTag()}
      </Button>
    );
  }
  if (nodeIsTaxes) {
    return (
      <Button
        variant="outlined"
        size="small"
        sx={{
          color: getAuthorizationColor(),
          borderColor: getAuthorizationColor(),
          p: 0.2,
          fontSize: 8,
        }}
      >
        {proformaStatusTag()}
      </Button>
    );
  }
  return null;
}

export function ListDocuments({
  crossingId = '',
  node,
  isOpen,
  onToggle,
  depth,
  refetch = () => {},
}: Props) {
  const { t } = useTranslation();
  const [openModulationModal, setModulationModal] = useState(false);
  const isWithoutTxtFlow = (externalNodes: NodeModels[]) => {
    const isWithoutTxt = externalNodes.find((nodo: NodeModels) => nodo?.data?.tags === 'Factura' || nodo?.data?.firstDigitized);
    return !!isWithoutTxt;
  };
  const [errorVisibility, setErrorVisibility] = useState(false);
  const [changeTag, setChangeTag] = useState(false);
  const [isDigitized, setDigitized] = useState(
    node.data?.digitized || node?.data?.firstDigitized,
  );
  const { crossing, setCrossing } = useCrossing();

  useEffect(() => {
    setDigitized(node.data?.digitized || node?.data?.firstDigitized);
  }, [node.data?.digitized, node?.data?.firstDigitized]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(node.id);
  };

  const changeDigitized = (nodes: NodeModels[]) => nodes.map((n) => {
    if (n.id === node.id) {
      return {
        ...n,
        data: {
          ...n.data,
          firstDigitized: !isDigitized,
        },
      };
    }
    return n;
  });

  const handleOptions = (option: string) => {
    if (option === 'edit') {
      setErrorVisibility(true);
    }
    if (option === 'label') {
      setChangeTag(true);
    }
  };

  const handleDigitalized = () => {
    if (node.data?.digitized) return;
    const nodes = {
      ...crossing?.nodes,
      ...(node.parent === 'general-folder' && { externalNode: changeDigitized(crossing?.nodes?.externalNode || []) }),
      ...(node.parent === DISPATCH_FOLDER && {
        dispatchFileNode: changeDigitized(crossing?.nodes?.dispatchFileNode || []),
      }),
      ...(onlyNumbers.test(node.parent.toString()) && {
        tree: changeDigitized(crossing?.nodes?.tree || []),
      }),
    };
    setDigitized(!isDigitized);
    setCrossing({
      ...crossing,
      nodes,
      isWithoutTxtFlow: nodes?.tree?.length || [].length > 0
        ? false
        : isWithoutTxtFlow(nodes?.externalNode || []),
    });
  };

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

  if (node.data?.ext === 'txt') {
    const txtValidation = node.data?.validate;
    const onCloseErrorFixer = () => {
      refetch();
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
        key={node.id}
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
            <TypeIcon icon={node.data?.ext} url={node.data?.file?.url} />
          </Grid>
          <Grid container item xs={12} md={10} spacing={2}>
            <Grid item xs={12}>
              <ListItemText secondary={node.data?.name} />
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
                {
                  tagIssues(() => setErrorVisibility(!errorVisibility), node.data?.issues)
                }
              </Grid>
              <Grid item xs={12} md={1}>
                <OptionsComponent
                  node={node}
                  handleOption={handleOptions}
                  typeFile={node.data?.ext}
                />
                <ErrorFixerComponent
                  open={errorVisibility}
                  crossingId={crossingId}
                  nodes={[node]}
                  currentFile={depth}
                  nodeId={node.id.toString()}
                  onClose={onCloseErrorFixer}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Card>
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
          <Grid item xs={12} md={10}>
            {node?.data?.tags === 'Agregar DODA / PITA' && (
              <DodaPitaShortCut node={node} />
            )}
            {(node.data?.tags && node.data?.tags !== 'Agregar DODA / PITA') && (
              <>
                <Button
                  startIcon={<LabelIcon />}
                  variant="outlined"
                  size="small"
                  sx={{
                    p: 0.2,
                    fontSize: 8,
                    ...!node?.data?.integrationNumber && {
                      pointerEvents: 'none',
                    },
                  }}
                  onClick={() => {
                    openIntegration(node.data?.tags, node.data?.integrationNumber);
                    setModulationModal(!openModulationModal);
                  }}
                >
                  {node.data.tags}
                </Button>
                <ModalIntegrationNumber
                  node={node}
                  open={openModulationModal}
                  handleClose={() => setModulationModal(!openModulationModal)}
                />
              </>
            )}
            {
              node.data?.ext === 'pdf' && node.parent !== DISPATCH_FOLDER ? (
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
              ) : null
            }
            <AuthorizationTag
              t={t}
              node={node}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <OptionsComponent
              node={node}
              handleOption={handleOptions}
              typeFile={node.data?.ext || 'pdf'}
            />
            <ChangeTag
              open={changeTag}
              onClose={() => setChangeTag(false)}
              node={node}
              loading={false}
            />
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}

export default ListDocuments;
