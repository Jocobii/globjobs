/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable consistent-return */
import {
  FileDropZone,
  ResponseTags,
  NodeModels,
  IssuesResponse,
  FileWithIssue,
  FileData,
} from '@gsuite/typings/files';
import { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { aeach } from '@gsuite/shared/utils/aeach';
import { useState } from 'react';
import { TXT } from '@gsuite/shared/constants';
import {
  DropOptions,
} from '@minoru/react-dnd-treeview';
import { getUserSession } from '@gsuite/shared/contexts/AuthContext';
import { useCrossing } from '@gsuite/shared/contexts';
import { uploadFiles } from '@gsuite/shared/lib/uploadFile';
import { useCreateCruce, type ValidateFile } from '@gsuite/shared/services/cruces';
import { FieldValues } from 'react-hook-form';
import { get } from 'lodash';
import { useUpdateCruce } from '../services/cruce-update';
import { getTagsFiles } from '../services/crossingTags';
import { validateFiles } from '../services/validateTxtFile';
import { useValidateTxT, useUpdateTxT } from '../services/update-txt.files';
import { useSendCruce } from '../services/sendCrossing';
import { validateProforma } from '../services/validateProforma';
import type { NewData } from '../components/DialogValidate';
import { useAssignUser } from '../services/assign-user';

type SubmitProps = {
  closeDialog: () => void;
  refetch: () => void;
  sendingCrossing?: boolean;
  isOnlyCreation?: boolean;
  updateHistoryCreate?: (id: string, allFiles: string[], comments:string) => void;
  onSaveSuccessMessage?: string;
};

type TXTValues = {
  typeValue: number | undefined;
  numeroCliente: string;
  type: string;
};

type ResponseMessage = {
  type: 'error' | 'warning' | 'info' | 'success',
  message: string;
};

type ReadFile = {
  pedimento: string | undefined;
  clavePedimento: string | undefined;
  error: boolean;
};

type Folders = {
  [key: string]: string;
};

type GlobalNodes = {
  [key: string]: NodeModels[];
};

type Node = {
  dispatchFileNode: NodeModels[];
  externalNode: NodeModels[];
  tree: NodeModels[];
};

type NodeTXT = {
  type: 'tree' | 'external',
  nodes: NodeModels[];
};

const errorMessage = 'cruces.onSave.error';
const successMessage = 'cruces.onSave.updated';
const onlyNumbers = /^[0-9]+$/;
const dispatchFolder = 'dispatch-folder';
const generalFolder = 'general-folder';

const mappedNodes = (nodes: NodeModels[], parent = null) => nodes.map((e) => ({
  id: e.id,
  text: e.text,
  parent: parent || e.parent.toString(),
  droppable: e.droppable,
  data: e.data,
}));

const useCruce = () => {
  const { createCrossing } = useCreateCruce();
  const [checkCrossing] = useValidateTxT();
  const { crossing, dialogData, setDialogData } = useCrossing();
  const { updateCrossing } = useUpdateCruce();
  const {
    showSnackMessage,
    successMessage: displaySuccessMessage,
    errorMessage: displayErrorMessage,
    warningMessage: displayWarningMessage,
  } = useSnackNotification();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<FileDropZone[]>([]);
  const [tree, setTree] = useState<NodeModels[]>([]);
  const [externalNode, setExternalNode] = useState<NodeModels[]>([]);
  const [dispatchNodes, setDispatchNodes] = useState<NodeModels[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [updateTxT] = useUpdateTxT();
  const { sendCrossing } = useSendCruce();
  const [assignUser] = useAssignUser();

  const extension = (name: string) => {
    const split = name.split('.');
    return {
      name: split[0],
      ext: split[1]?.toLocaleLowerCase(),
    };
  };

  const removeRepetitionFromFileName = (fileName: string): string => fileName?.replace(/\s*\([^)]*\)\s*(\.[^.]+)$/, '$1');

  const sortFiles = (filesSort: FileDropZone[]): FileDropZone[] => [...filesSort].sort((a, b) => {
    const { ext: aExt } = extension(a.name);
    const { ext: bExt } = extension(b.name);
    if (aExt < bExt) {
      return 1;
    }
    if (aExt > bExt) {
      return -1;
    }
    return 0;
  });

  const flatTreeNodes = (nodes: unknown): NodeModels[] => Object.entries(nodes as Node)
    .reduce<NodeModels[]>(
    (prev, [, node = []]) => prev.concat(
      node.filter((x) => x.parent !== '0' && x.id !== 'dispatch-folder-dummy').map((x) => x),
    ),
    [],
  ) || [];

  const validateAndCompareFormFieldsWithTxt = (
    file: FileDropZone,
    txtValues: TXTValues,
    formValues: FieldValues,
  ) => {
    const {
      typeValue, numeroCliente, type,
    } = txtValues;
    const errors = [];

    if (typeValue !== Number(type)) errors.push(`El tipo de operacion seleccionado no corresponde con el de TXT ${file.name}`);

    if (formValues.clientNumber !== numeroCliente) errors.push(`El numero de cliente no corresponde con el de TXT ${file.name}`);

    return errors;
  };

  const dummyDispatchFileNode = () => ([
    {
      id: dispatchFolder,
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
  ]);

  const readTxtFile = (
    file: FileDropZone,
    formValues: FieldValues,
  ): Promise<ReadFile | undefined> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const contentFile = reader.result as string;
      const splitSection = contentFile.split('\n');
      const section501 = splitSection.find((text) => text.includes('501'));
      const pedimento = section501?.split('|')[TXT['501'].PEDIMENTO] || '';
      const type = section501?.split('|')[TXT['501'].TIPO] || '';
      const clavePedimento = section501?.split('|')[TXT['501'].CLAVE] || '';
      const numeroCliente = section501?.split('|')[TXT['501'].CLIENTE_NUMBER] || '';
      const typeValue = formValues.type === 'Importacion' ? 1 : 2;
      const txtValues = {
        typeValue, numeroCliente, type,
      };

      let hasPedimento = false;
      if (!pedimento) {
        displayErrorMessage(`El TXT ${file.name} no contiene un pedimento`, { vertical: 'top', horizontal: 'center' });
        hasPedimento = true;
      }
      const errors = validateAndCompareFormFieldsWithTxt(file, txtValues, formValues);
      if (errors.length > 0) {
        errors.forEach((error) => displayErrorMessage(error));
      }

      const section505 = splitSection.find((text) => text.includes('505'));
      const invoiceNumber = section505?.split('|')[1];
      resolve({
        pedimento: `${pedimento},${invoiceNumber}`,
        clavePedimento,
        error: hasPedimento || errors.length > 0,
      });
    };
    reader.onerror = reject;
    reader.readAsText(file as File);
  });

  const validateExitsFile = (
    name: string,
    treeValidate: NodeModels[],
    ExternalNodes: NodeModels[],
  ): boolean => {
    const searchFile = treeValidate.map(({ data }) => data?.file?.name === name);
    const searchExternalFile = ExternalNodes.map(({ data }) => data?.file?.name === name);
    return searchFile.concat(searchExternalFile).includes(true);
  };

  const nodesFileTxt = async (
    file: FileDropZone,
    id: string,
    name: string,
    ext: string,
    formValues: FieldValues,
  ): Promise<NodeTXT | null> => {
    const data = await readTxtFile(file, formValues);
    const { pedimento, clavePedimento, error } = data || {};
    if (!pedimento) return null;
    if (pedimento) {
      const folderText = `pedimento ${pedimento?.split(',')[0]} - ${clavePedimento ?? ''}`;
      const folder = {
        id: pedimento?.split(',')[0],
        text: folderText,
        parent: '0',
        droppable: true,
        data: {
          delete: error,
        },
      };

      const node = {
        id: pedimento,
        text: name,
        parent: folder.id,
        droppable: false,
        data: {
          file,
          ext,
          name: file.name,
          extraData: {
            clavePedimento,
          },
        },
      };
      return { nodes: [folder, node], type: 'tree' };
    }

    const node = {
      id: `${name}-${id}`,
      text: name,
      parent: '0',
      droppable: false,
      data: {
        file,
        ext,
        name: file.name,
      },
    };
    return { nodes: [node], type: 'external' };
  };

  const getValidateTxt = (
    nodes: NodeModels[],
    aduana: string,
    patente: string,
    clientNumber: string,
    type: string,
  ) => {
    const validate = nodes.filter(({ data }) => data?.ext === 'txt');
    return validate.map((v) => {
      const id = v.id as string;
      const [pedimento, invoice] = id.split(',');

      return {
        fileId: id,
        pedimento,
        aduana,
        patente,
        factura: invoice,
        clientNumber,
        clavePedimento: v.data?.extraData ? v?.data?.extraData?.clavePedimento : '',
        type: type === 'Importacion' ? '1' : '2',
      };
    });
  };
  const initExternalNodes = (externalNodes: NodeModels[]) => {
    const generalRootfolder = externalNode.find((node) => node.id === generalFolder);
    return generalRootfolder ? [...externalNodes] : [{
      id: generalFolder,
      parent: '0',
      text: 'Archivos Generales',
      droppable: true,
    }];
  };

  const removeNodesDeleted = (nodes: NodeModels[]) => {
    const folderParents = nodes.filter((n) => n?.data?.delete).map((n) => n.id);
    const fileParents = nodes.filter((n) => n?.data?.delete).map((n) => n.parent);
    const newNodes = nodes.filter(
      (n) => !folderParents.includes(n.parent),
    ).filter((n2) => !n2?.data?.delete)
      . filter((n3) => !fileParents.includes(n3.id));

    return {
      nodes: newNodes.map((n) => {
        if (!n?.data?.file) {
          return {
            ...n,
            data: undefined,
          };
        }
        return n;
      }),
    };
  };

  const createNodes = async (
    filesCreate: FileDropZone[],
    treeCreate: NodeModels[],
    externalNodes: NodeModels[],
    formValues: FieldValues,
  ): Promise<{
    nodes: NodeModels[],
    externalNodes: NodeModels[],
  }> => {
    const newExternalNodes = initExternalNodes(externalNodes);
    const newTree = [...treeCreate];

    const filesSorted = sortFiles(filesCreate);

    await aeach({
      array: filesSorted,
      callback: async (item) => {
        const id = String(Math.floor(10000 + Math.random() * 90000));
        const { name, ext } = extension(item.name);
        const validatedTree = validateExitsFile(item.name, newTree, newExternalNodes);
        if (validatedTree) return;
        if (ext === 'txt') {
          const validNodes = await nodesFileTxt(
            item,
            id,
            name,
            ext,
            formValues,
          );

          if (!validNodes?.nodes || !validNodes?.type) return;

          if (validNodes.type === 'tree') {
            newTree.push(...validNodes.nodes);
            return;
          }
          newExternalNodes.push(...validNodes.nodes);
          return;
        }

        const indexFile = newTree
          .findIndex((node) => name?.toLocaleLowerCase() === node.text.toLocaleLowerCase());
        if (indexFile !== -1) {
          newTree.push({
            id: `${name}-${id}`,
            text: name,
            parent: newTree[indexFile].parent,
            droppable: false,
            data: {
              file: item,
              ext,
              name: item.name,
              ...ext === 'pdf' && { digitized: false, firstDigitized: false },
            },
          });
          return;
        }
        newExternalNodes.push({
          id: `${name}-${id}`,
          text: name,
          parent: generalFolder,
          droppable: false,
          data: {
            file: item,
            ext,
            name: item.name,
            ...ext === 'pdf' && { digitized: false },
          },
        });
      },
    });
    const uniqueNodes = [...new Map(newTree.map((v) => [v.id, v])).values()];
    const { nodes: newNodes } = removeNodesDeleted(uniqueNodes);

    return { nodes: newNodes, externalNodes: newExternalNodes };
  };

  const addValidateTxt = (
    fileValidate: ValidateFile[],
    nodes: NodeModels[],
    prevNodes: NodeModels[] = [],
  ) => {
    const parentsDeleteds = [] as string[];
    const orphanedNodes = [] as NodeModels[];
    const currentNodes = nodes.map((node) => {
      const id = node.id as string;
      let hasError = false;
      let nodeAlreadyExist = false;
      if (Array.isArray(prevNodes) && prevNodes.length > 0) {
        const prevNodeIndex = prevNodes.findIndex(
          (n) => n.data?.file?.name === node.data?.file?.name,
        );

        nodeAlreadyExist = prevNodeIndex >= 0;
      }

      if (!fileValidate
        .find((validate) => id === get(validate, 'data.number', '').toString() || id === validate.fileId) && node.data?.ext === 'txt'
        && !nodeAlreadyExist
      ) {
        parentsDeleteds.push(id);
        displayErrorMessage(`El archivo ${node.id} sera eliminado ya que no cumplio con las condiciones`);
        hasError = true;
      }
      const searchFile = fileValidate.find((validate) => id === validate.fileId);
      if (searchFile) {
        if (searchFile.data?.FechaDePagoBanco) {
          parentsDeleteds.push(get(searchFile, 'data.number', ''));
          hasError = true;
        }
        return {
          ...node,
          data: {
            ...node.data,
            validate: searchFile.validated,
            valueDarwin: searchFile.data,
            delete: hasError,
          },
        } as unknown as NodeModels;
      }
      const parent = fileValidate.find(
        (validate) => id === validate.data?.number && validate.data?.FechaDePagoBanco,
      );
      if (parent) hasError = true;
      if (parentsDeleteds.includes(node.parent.toString())) {
        orphanedNodes.push({
          ...node,
          parent: '0',
          data: {
            ...node.data,
          },
        } as unknown as NodeModels);
        hasError = true;
      }
      return {
        ...node,
        data: {
          ...node.data,
          delete: hasError,
        },
      };
    }) as NodeModels[];
    const nodesValidate = currentNodes.filter((node) => Boolean(node));
    if (parentsDeleteds.length > 0) displayWarningMessage(t('cruces.pedimentosOmmited'), { horizontal: 'center', vertical: 'top' });
    const { nodes: newNodes } = removeNodesDeleted(nodesValidate);
    return { nodesValidate: newNodes, orphanedNodes };
  };

  const getTags = async (treeTags: NodeModels[], externalNodes: NodeModels[]) => {
    const nodes = [...treeTags];
    const external = [...externalNodes];
    const allFiles = nodes.concat(external);
    const filesFiltered = allFiles.filter(({ data }) => data?.ext && !data.tags && data?.ext !== 'txt');
    const nodeFiles = filesFiltered.map(({ data }) => {
      if (data) {
        return data.file;
      }
      return null;
    });
    const filterNodes = nodeFiles.filter((node) => node) as FileDropZone[];
    const data = await getTagsFiles(filterNodes);

    if (Array.isArray(data)) {
      const tags: ResponseTags[] = data;
      tags.forEach((tag: ResponseTags) => {
        const index = treeTags.findIndex(
          (file) => file.data?.name?.toLocaleLowerCase() === tag.file.toLocaleLowerCase(),
        );
        if (index !== -1) {
          nodes[index].data = {
            ...nodes[index].data,
            tags: tag.tag,
          };
        } else {
          const indexExternal = external.findIndex(
            (file) => file.data?.name?.toLocaleLowerCase() === tag.file.toLocaleLowerCase(),
          );
          if (indexExternal !== -1) {
            external[indexExternal].data = {
              ...external[indexExternal].data,
              tags: tag.tag,
            };
          }
        }
      });
    }

    return {
      nodesTags: nodes,
      externalNodesTags: external,
    };
  };

  const handleDigitalizeExternalNode = (nodeId: string | number) => {
    const currentExternalNodes: NodeModels[] = JSON.parse(JSON.stringify(externalNode));
    const targetNode = currentExternalNodes.find((n) => n.id === nodeId);

    if (targetNode?.data?.digitized) return;

    const newExternalNodes = currentExternalNodes.map((n) => {
      if (n.id === nodeId) {
        return {
          ...n,
          data: {
            ...n.data,
            firstDigitized: !n.data?.firstDigitized,
          },
        };
      }
      return n;
    });

    setExternalNode(newExternalNodes);
  };

  const updateGeneralFolder = (
    clenedTree: NodeModels[],
    filteredDispatch: NodeModels[] | null,
    filteredTree: NodeModels[] | null,
  ) => {
    const newCrossing = { ...crossing };

    setExternalNode(mappedNodes(clenedTree));
    if (!crossing?.id) return;
    updateCrossing({
      variables: {
        crossing: {
          ...newCrossing,
          nodes: {
            externalNode: mappedNodes(clenedTree),
            dispatchFileNode: filteredDispatch || dispatchNodes,
            tree: filteredTree || tree,
          },
        },
      },
      context: { clientName: 'globalization' },
      onCompleted: () => displaySuccessMessage(t(successMessage), { vertical: 'top', horizontal: 'center' }),
    }).catch(() => displayErrorMessage(t(errorMessage), { vertical: 'top', horizontal: 'center' }));
  };

  const updateDispatchFolder = (
    clenedTree: NodeModels[],
    filteredExternal: NodeModels[] | null,
    filteredTree: NodeModels[] | null,
  ) => {
    const newCrossing = { ...crossing };

    setDispatchNodes(mappedNodes(clenedTree));
    if (!crossing?.id) return;
    updateCrossing({
      variables: {
        crossing: {
          ...newCrossing,
          nodes: {
            externalNode: filteredExternal || externalNode,
            dispatchFileNode: mappedNodes(clenedTree),
            tree: filteredTree || tree,
          },
        },
      },
      context: { clientName: 'globalization' },
      onCompleted: () => displaySuccessMessage(t(successMessage), { vertical: 'top', horizontal: 'center' }),
    }).catch(() => displayErrorMessage(t(errorMessage), { vertical: 'top', horizontal: 'center' }));
  };

  const updateTreeFolder = (
    clenedTree: NodeModels[],
    filteredExternal: NodeModels[] | null,
    filteredDispatch: NodeModels[] | null,
  ) => {
    const newCrossing = { ...crossing };

    setTree(mappedNodes(clenedTree));
    if (!crossing?.id) return;
    updateCrossing({
      variables: {
        crossing: {
          ...newCrossing,
          nodes: {
            externalNode: filteredExternal || externalNode,
            dispatchFileNode: filteredDispatch || dispatchNodes,
            tree: mappedNodes(clenedTree),
          },
        },
      },
      context: { clientName: 'globalization' },
      onCompleted: () => displaySuccessMessage(t(successMessage), { vertical: 'top', horizontal: 'center' }),
    }).catch(() => displayErrorMessage(t(errorMessage), { vertical: 'top', horizontal: 'center' }));
  };

  const handleDropTree = (newTree: NodeModels[], options: DropOptions) => {
    const { dropTargetId, monitor } = options;

    const globalNodes: GlobalNodes = {
      tree,
      externalNode,
      dispatchNodes,
    };

    if (!dropTargetId) return;
    const folders: Folders = {
      'general-folder': 'externalNode',
      'dispatch-folder': 'dispatchNodes',
    };
    const { id: nodeId, parent } = monitor.getItem();
    const origin = String(parent).toLocaleLowerCase();
    const originFolder = folders[origin] || 'tree';
    if (
      (dropTargetId === dispatchFolder && originFolder === 'tree') || (onlyNumbers.test(dropTargetId.toString()) && origin === dispatchFolder)) {
      displayErrorMessage('Movimiento no valido');
      return;
    }
    const originNodes = globalNodes[originFolder];
    const filteredOldNodes = originNodes.filter((node) => node.id !== nodeId);

    let filteredExternal = null;
    let filteredTree = null;
    let filteredDispatch = null;

    if (originFolder === 'externalNode') {
      setExternalNode(filteredOldNodes);
      filteredExternal = filteredOldNodes;
    }
    if (originFolder === 'dispatchNodes') {
      setDispatchNodes(filteredOldNodes);
      filteredDispatch = filteredOldNodes;
    }
    if (originFolder === 'tree') {
      const newFilteredTree = filteredOldNodes.map((e) => ({ ...e, parent: e.parent.toString() }));
      setTree(newFilteredTree);
      filteredTree = newFilteredTree;
    }

    const clenedTree = newTree.map((node) => {
      if (node.id === nodeId) {
        return {
          id: node.id,
          text: node.text,
          parent: dropTargetId.toString(),
          droppable: node.droppable,
          data: node.data,
        };
      }
      return node;
    });

    if (dropTargetId === generalFolder) {
      updateGeneralFolder(clenedTree, filteredDispatch, filteredTree);
      return;
    }

    if (dropTargetId === dispatchFolder) {
      updateDispatchFolder(clenedTree, filteredExternal, filteredTree);
      return;
    }
    updateTreeFolder(clenedTree, filteredExternal, filteredDispatch);
  };

  const getTxtIssues = async (
    clientNumber: string,
    operationType: number,
    txtFiles: NodeModels[],
  ): Promise<AxiosResponse<IssuesResponse>> => {
    const nodeFiles = txtFiles.map(({ data }) => {
      if (data) {
        return data.file;
      }
      return null;
    });
    const filterNodes = nodeFiles.filter((node) => node) as FileDropZone[];
    return validateFiles({
      clientNumber,
      operationType,
      nodes: txtFiles,
      files: filterNodes,
    });
  };

  const validateProformaFile = (
    filesUploaded: FileDropZone[],
  ) => validateProforma({ files: filesUploaded });

  const issuesFile = (issues: IssuesResponse, nodes: NodeModels[]) => nodes.map((n: NodeModels) => {
    if (n.data && issues.files) {
      const { text: name } = n;
      const issue = issues.files
        .find((f: FileWithIssue) => name.toLowerCase().includes(f.name.toLowerCase()));
      return {
        ...n,
        data: {
          ...n.data,
          ...(issue && { issues: issue }),
        },
      };
    }
    return n;
  });

  const addFilesS3 = (filesResponse: FileData[]) => {
    const newTree = [...tree];
    const newExternalNodes = [...externalNode];
    filesResponse.forEach(({ url, key }) => {
      const index = newTree.findIndex((node) => node.data?.name === key);
      if (index !== -1) {
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
    return { nodes: newTree, externalNodes: newExternalNodes };
  };

  const validations = async (
    data: SubmitProps,
    fileNames: string[],
    comments: string,
    id: string,
  ) => {
    const {
      closeDialog,
      refetch,
      updateHistoryCreate,
    } = data;

    if (closeDialog) closeDialog();
    if (refetch) refetch();
    if (updateHistoryCreate) {
      await updateHistoryCreate(
        id,
        fileNames,
        comments,
      );
    }
  };

  const handleSubmit = async (
    filesResponse: FileData[],
    formValues: FieldValues,
    isOnlyCreation: boolean,
    response: ResponseMessage,
    sendingCrossing: boolean,
    isWithoutTxtFlow?: boolean,
  ) => {
    const {
      type, client, clientNumber, patente, aduana, comments, customerUser, team,
      trafficType,
    } = formValues;

    if (!Array.isArray(filesResponse)) return;
    const { nodes, externalNodes } = addFilesS3(filesResponse as FileData[]);
    nodes.forEach((node) => {
      const newNode = { ...node };
      if (newNode.data) delete newNode.data?.extraData;
    });

    const { _id: id } = customerUser;
    if (['maritimo', 'maritime'].includes(trafficType.toLowerCase().trim())) {
      const allNodes = [
        ...nodes,
        ...externalNode,
      ].filter((node) => node.parent !== '0');

      let mblFlag = false;
      let facturaFlag = false;
      let packingListFlag = false;
      let booking = false;
      allNodes.forEach((node) => {
        if (node?.data?.tags?.toLocaleLowerCase().includes('mbl')) mblFlag = true;
        if (node?.data?.tags?.toLocaleLowerCase().includes('factura')) facturaFlag = true;
        if (node?.data?.tags?.toLocaleLowerCase().includes('packing list')) packingListFlag = true;
        if (node?.data?.tags?.toLocaleLowerCase().includes('booking')) booking = true;
      });
      const facturaRequired = !facturaFlag ? 'Factura' : '';

      if (crossing?.type?.toLowerCase() === 'importacion' && (!mblFlag || !facturaFlag || !packingListFlag)) {
        const mblRequired = !mblFlag ? 'MBL' : '';
        const packingListRequired = !packingListFlag ? 'Packing List' : '';
        const message = `Los archivos ${mblRequired}, ${facturaRequired}, ${packingListRequired} son requeridos para el tipo de trafico maritimo importacion`;
        return displayErrorMessage(message);
      }

      if (crossing?.type?.toLowerCase() === 'exportacion' && (!booking || !facturaFlag)) {
        const bookingRequired = !booking ? 'Booking' : '';
        const message = `Los archivos ${facturaRequired}, ${bookingRequired} son requeridos para el tipo de trafico maritimo exportacion`;
        return displayErrorMessage(message);
      }
    }

    try {
      const createResponse = await createCrossing({
        variables: {
          crossing: {
            type,
            client,
            clientNumber,
            patente,
            aduana,
            trafficType: trafficType === 'maritimo' ? 'maritime' : 'land',
            team,
            customerUser: {
              id: String(id),
              name: customerUser.name,
              lastName: customerUser.lastName,
            },
            comments,
            nodes: {
              tree: nodes,
              externalNode: externalNodes,
              ...(sendingCrossing && {
                dispatchFileNode: trafficType === 'maritimo' ? [] : dummyDispatchFileNode(),
              }),
            },
            isOnlyCreation,
            isWithoutTxtFlow,
          },
        },
        onError: (e) => console.log('error', e),
        context: { clientName: 'globalization' },
      });

      if (!sendingCrossing) {
        showSnackMessage(t('cruces.onSave.success'), 'success');
      }
      return get(createResponse, 'data.createCrossing.id', '');
    } catch (error) {
      return displayErrorMessage(response.message, { vertical: 'top', horizontal: 'center' });
    }
  };
  const sendDarwin = async (
    crossingId: string,
  ): Promise<ResponseMessage> => {
    try {
      await sendCrossing({
        variables: {
          id: crossingId,
        },
      });
      return {
        type: 'success',
        message: t('cruces.onSend.success'),
      };
    } catch (error) {
      return {
        type: 'error',
        message: t('cruces.onSend.error'),
      };
    }
  };
  const handleSendToDarwin = async (
    id: string,
    response: ResponseMessage,
    data: SubmitProps,
    fileNames: string[],
    comments: string,
  ) => {
    let responseMessage = response;
    const { data: checkTxt } = await checkCrossing({
      variables: {
        crossingId: id,
      },
    });

    const validateTxT = get(checkTxt, 'checkCrossing');
    if (validateTxT?.isValid) {
      responseMessage = await sendDarwin(id);
      await validations(data, fileNames, comments, id);
    } else if (validateTxT) {
      return setDialogData({
        ...validateTxT,
        id,
        closeDialog: data.closeDialog,
        refetch: data.refetch,
        updateHistoryCreate: data.updateHistoryCreate,
        fileNames,
        comments,
      });
    }
    return displaySuccessMessage(responseMessage.message, { vertical: 'top', horizontal: 'center' });
  };
  const onSubmit = async ({
    type, client, clientNumber, patente, aduana, comments, isWithoutTxtFlow, customerUser, team,
    trafficType,
  }: FieldValues, {
    closeDialog,
    refetch,
    sendingCrossing = false,
    isOnlyCreation = true,
    updateHistoryCreate,
  }: SubmitProps) => {
    const formValues = {
      type, client, clientNumber, patente, aduana, comments, customerUser, team, trafficType,
    };
    const filesTree = tree.map((node) => node.data?.file);
    const filesExternal = externalNode.map((node) => node.data?.file);
    const filesUpload = [...filesTree, ...filesExternal].filter((file) => file) as FileDropZone[];
    if (!filesUpload || filesUpload.length === 0) {
      displayErrorMessage('Los archivos son requeridos', { vertical: 'top', horizontal: 'center' });
      return;
    }

    setLoading(true);

    const filesResponse = await uploadFiles(filesUpload);
    const responseMessage: ResponseMessage = {
      type: 'error',
      message: sendingCrossing ? t('cruces.onSend.error') : t('cruces.onSave.error'),
    };

    if (Array.isArray(filesResponse)) {
      const { nodes, externalNodes } = addFilesS3(filesResponse as FileData[]);
      const fileNames = [...externalNodes, ...nodes]
        .map((e) => e.data?.name)
        .filter((e) => Boolean(e)) as string[];
      const crossingId = await handleSubmit(
        filesResponse,
        formValues,
        isOnlyCreation,
        responseMessage,
        sendingCrossing,
        isWithoutTxtFlow,
      );
      if (!crossingId) {
        setLoading(false);
        return 'error';
      }
      const data = {
        closeDialog,
        refetch,
        updateHistoryCreate,
      };

      if (sendingCrossing && crossingId) {
        await handleSendToDarwin(crossingId, responseMessage, data, fileNames, comments);
        setLoading(false);
        return;
      }
      await validations(data, fileNames, comments, crossingId);
      setLoading(false);
      return;
    }

    setLoading(false);
    return showSnackMessage(
      responseMessage.message,
      responseMessage.type,
    );
  };

  const handleCloseDialog = () => {
    setDialogData({
      isValid: true,
      plates: [],
      economic: [],
      country: [],
    });
  };

  const setUser = async () => {
    const getUser = await getUserSession().catch(() => {});
    await assignUser({
      variables: {
        crossingId: crossing?.id ?? dialogData?.id,
        userId: getUser?.user?.id,
      },
    });
  };

  const handleUpdateTxtFiles = async (newData: NewData) => {
    const user = await getUserSession().catch(() => {});
    const dialogId = get(dialogData, 'id', '');
    try {
      await updateTxT({
        variables: {
          data: {
            ...newData,
            id: dialogId,
          },
        },
      });

      await sendDarwin(dialogId);
      handleCloseDialog();
      const defaultFunction = () => {};
      const data = {
        closeDialog: get(dialogData, 'closeDialog', defaultFunction),
        refetch: get(dialogData, 'refetch', defaultFunction),
        updateHistoryCreate: get(dialogData, 'updateHistoryCreate', defaultFunction),
      };

      if (user.id && user.id !== crossing?.user?.id) {
        setUser();
      }
      await validations(data, get(dialogData, 'fileNames', []), get(dialogData, 'comments', ''), dialogId);
      showSnackMessage(t('cruces.send_to_darwin_created'), 'success');
    } catch (error) {
      console.log(error);
    }
  };

  return {
    extension,
    loading,
    files,
    tree,
    externalNode,
    dialogData,
    setLoading,
    setExternalNode,
    setTree,
    setFiles,
    createNodes,
    getValidateTxt,
    addValidateTxt,
    getTags,
    handleDropTree,
    handleDigitalizeExternalNode,
    onSubmit,
    getTxtIssues,
    issuesFile,
    sortFiles,
    openDialog,
    setOpenDialog,
    t,
    validateProformaFile,
    dispatchNodes,
    setDispatchNodes,
    removeNodesDeleted,
    handleUpdateTxtFiles,
    addFilesS3,
    flatTreeNodes,
    removeRepetitionFromFileName,
    readTxtFile,
  };
};

export default useCruce;
