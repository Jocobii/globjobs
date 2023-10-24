/* eslint-disable consistent-return */
import {
  FileDropZone,
  ResponseTags,
  NodeModels,
  IssuesResponse,
  FileWithIssue,
  FileData,
} from '@gsuite/typings/files';
import { ApolloError } from '@apollo/client';
import { AxiosResponse } from 'axios';
import { useTranslation } from 'react-i18next';
import get from 'lodash/get';
import { NotificationsContext } from '@gsuite/shared/contexts/NotificationsContext';
import { useValidateFiles, useGetCrucesList } from '@gsuite/shared/services/cruces';
import { useState, useContext } from 'react';
import { TXT } from '@gsuite/shared/constants';
import { getUserSession } from '@gsuite/shared/contexts/AuthContext';
import { useClientNumber } from '@gsuite/shared/services/back-office';
import {
  DropOptions,
} from '@minoru/react-dnd-treeview';
import { FieldValues } from 'react-hook-form';
import { aeach } from '../utils/aeach';
import { uploadFiles } from '../utils/uploadFile';
import { ValidateFile } from '../services/cruces/validatedPedimento';
import { getTagsFiles } from '../services/cruces/crossingTags';
import { useCreateCruce } from '../services/cruces/cruce-create';
import { useRequestDraftOperation } from '../services/cruces/requestDraftOperation';
import { validateFiles } from '../services/cruces/validateTxtFile';
import useSnackNotification from './useSnackNotification';

type SubmitProps = {
  closeDialog?: () => void;
  refetch?: () => void;
  sendingCrossing?: boolean;
  showConfirmation?: (id: string) => void;
  updateHistoryCreate?: (id: string, allFiles: string[], comments:string) => void;
  onSaveSuccessMessage?: string;
};

interface TXTValues {
  numeroCliente: string;
}

type ResponseMessage = {
  type: 'error' | 'warning' | 'info' | 'success',
  message: string;
};

type RequestDraftOperation = {
  id: string,
  showConfirmation: (id: string) => void;
  updateHistory: (id: string, allFiles: string[]) => any;
  refetch?: any;
};

const onlyNumbers = /^[0-9]+$/;
const generalFolder = 'general-folder';
const dispatchFolder = 'dispatch-folder';
const mappedNodes = (nodes: NodeModels[], parent = null) => nodes.map((e) => ({
  id: e.id,
  text: e.text,
  parent: parent || e.parent.toString(),
  droppable: e.droppable,
  data: e.data,
}));

const useCruce = () => {
  const [getClientNumbers] = useClientNumber();
  const [variables, setVariables] = useState<Record<string, unknown>>();
  const { setSnackBar } = useContext(NotificationsContext);
  const { errorMessage } = useSnackNotification();
  const { createCrossing } = useCreateCruce();
  const { requestDraftOperation } = useRequestDraftOperation();
  const { t } = useTranslation();
  const [validatePedimento] = useValidateFiles();
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<FileDropZone[]>([]);
  const [tree, setTree] = useState<NodeModels[]>([]);
  const [dispatchNodes, setDispatchNodes] = useState<NodeModels[]>([]);
  const [externalNode, setExternalNode] = useState<NodeModels[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const {
    data: crossingsList,
    loading: loadingList,
    setStatus,
    status,
    refetch: crossingsListRefetch,
  } = useGetCrucesList(variables);

  const extension = (name: string) => {
    const split = name.split('.');
    return {
      name: split[0],
      ext: split[1]?.toLocaleLowerCase(),
    };
  };

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

  type ReadFile = {
    pedimento: string | undefined;
    clavePedimento: string | undefined;
    error: boolean;
  };

  const validateAndCompareFormFieldsWithTxt = (
    file: FileDropZone,
    txtValues: TXTValues,
    clinetNumbers: string[],
  ) => {
    const {
      numeroCliente,
    } = txtValues;
    const errors = [];

    if (!clinetNumbers.includes(numeroCliente)) errors.push(`El numero de cliente no corresponde con el de TXT ${file.name}`);

    return errors;
  };

  const readTxtFile = (
    file: FileDropZone,
    clientNumbers: string[],
  ): Promise<ReadFile> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const contentFile = reader.result as string;
      const splitSection = contentFile.split('\n');
      const section501 = splitSection.find((text) => text.includes('501'));
      const pedimento = section501?.split('|')[TXT['501'].PEDIMENTO];
      const clavePedimento = section501?.split('|')[TXT['501'].CLAVE] || '';
      const numeroCliente = section501?.split('|')[TXT['501'].CLIENTE_NUMBER] || '';
      const txtValues = {
        numeroCliente,
      };

      let hasPedimento = false;
      if (!pedimento) {
        setSnackBar('error', `El TXT ${file.name} no contiene un pedimento`);
        hasPedimento = true;
      }
      const errors = validateAndCompareFormFieldsWithTxt(file, txtValues, clientNumbers);
      if (errors.length > 0) {
        errors.forEach((error) => setSnackBar('error', error, 4000));
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
    if (treeValidate.length === 0 && ExternalNodes.length === 0) return false;
    const searchFile = treeValidate.map(({ data }) => data?.file?.name === name);
    const searchExternalFile = ExternalNodes.map(({ data }) => data?.file?.name === name);
    return searchFile.concat(searchExternalFile).includes(true);
  };

  const nodesFileTxt = async (
    file: FileDropZone,
    id: string,
    name: string,
    ext: string,
    clientNumbers: string[],
  ) => {
    const data = await readTxtFile(file, clientNumbers);

    const { pedimento, clavePedimento, error } = data;

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
      const [pedimento] = id.split(',');

      return {
        fileId: id,
        pedimento,
        aduana,
        patente,
        clientNumber,
        type: type === 'Importacion' ? '1' : '2',
      };
    });
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

  const initExternalNodes = (externalNodes: NodeModels[]) => {
    const generalRootfolder = externalNode.find((node) => node.id === generalFolder);
    return generalRootfolder ? [...externalNodes] : [{
      id: generalFolder,
      parent: '0',
      text: 'Archivos Generales',
      droppable: true,
    }];
  };

  const getUserClientNumbers = async () => {
    const session = await getUserSession();
    const { data } = await getClientNumbers({
      variables: {
        id: session.user.id,
      },
    });
    return data?.getClientNumbers ?? [];
  };

  const createNodes = async (
    filesCreate: FileDropZone[],
    treeCreate: NodeModels[],
    externalNodes: NodeModels[],
  ): Promise<{
    nodes: NodeModels[],
    externalNodes: NodeModels[],
  }> => {
    const newExternalNode = initExternalNodes(externalNodes);
    const newTree = [...treeCreate];
    const newExternalNodes = [...newExternalNode];
    const filesSorted = sortFiles(filesCreate);
    const clientNumbers = await getUserClientNumbers();
    await aeach({
      array: filesSorted,
      callback: async (item) => {
        const id = String(Math.floor(10000 + Math.random() * 90000));
        const { name, ext } = extension(item.name);
        const validatedTree = validateExitsFile(item.name, newTree, newExternalNodes);
        if (validatedTree) return;
        if (ext === 'txt') {
          const validNodes = await nodesFileTxt(item, id, name, ext, clientNumbers);

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
  ) => {
    const parentsDeleteds = [] as string[];
    const orphanedNodes = [] as NodeModels[];
    const currentNodes = nodes.map((node) => {
      const id = node.id as string;
      let hasError = false;
      if (!fileValidate
        .find((validate) => id === validate?.data?.number?.toString() || id === validate.fileId) && node.data?.ext === 'txt'
      ) {
        parentsDeleteds.push(id);
        setSnackBar('error', `El archivo ${node.id} sera eliminado ya que no cumplio con las condiciones`);
        hasError = true;
      }
      const searchFile = fileValidate.find((validate) => id === validate.fileId);
      if (searchFile) {
        if (searchFile.data?.FechaDePagoBanco) {
          parentsDeleteds.push(searchFile?.data?.number as string);
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
      if (parent) {
        return;
      }
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
    if (parentsDeleteds.length > 0) setSnackBar('warning', t<string>('cruces.pedimentosOmmited'));
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
        const index = treeTags.findIndex((file) => file.data?.name === tag.file);
        if (index !== -1) {
          nodes[index].data = {
            ...nodes[index].data,
            tags: tag.tag,
          };
        } else {
          const indexExternal = external.findIndex((file) => file.data?.name === tag.file);
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

  type Folders = {
    [key: string]: string;
  };

  type GlobalNodes = {
    [key: string]: NodeModels[];
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
    const originFolder = folders[origin as string] || 'tree';
    if (
      (dropTargetId === dispatchFolder && originFolder === 'tree') || (onlyNumbers.test(dropTargetId.toString()) && origin === dispatchFolder)) {
      setSnackBar('error', 'Movimiento no valido');
      return;
    }
    const originNodes = globalNodes[originFolder];
    const filteredOldNodes = originNodes.filter((node) => node.id !== nodeId);

    if (originFolder === 'externalNode') setExternalNode(filteredOldNodes);
    if (originFolder === 'dispatchNodes') setDispatchNodes(filteredOldNodes);
    if (originFolder === 'tree') setTree(filteredOldNodes.map((e) => ({ ...e, parent: e.parent.toString() })));

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
      setExternalNode(mappedNodes(clenedTree));
      return;
    }

    if (dropTargetId === dispatchFolder) {
      setDispatchNodes(mappedNodes(clenedTree));
      return;
    }
    setTree(mappedNodes(clenedTree));
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

  const addFilesS3 = (
    filesResponse: FileData[],
    prevTree?: NodeModels[],
    PrevExternal?: NodeModels[],
  ) => {
    const newTree = prevTree ?? [...tree];
    const newExternalNodes = PrevExternal ?? [...externalNode];
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

  const getFile = (node: NodeModels) => node.data?.file;

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

  const addFile = async (fromData: FieldValues) => {
    const { nodes, externalNodes } = await createNodes(files, tree, externalNode);
    const {
      type, aduana, patente, clientNumber,
    } = fromData;

    const validation = getValidateTxt(nodes, aduana, patente, clientNumber, type);
    const { data: fileValidate } = await validatePedimento({
      variables: {
        validateFiles: validation,
      },
    });

    const { validatePedimento: arrayValidate } = fileValidate;
    const nodesValidateDarwin = arrayValidate
      .filter((node: any) => node.data);
    const { nodesValidate, orphanedNodes } = addValidateTxt(nodesValidateDarwin, nodes);
    if (!nodesValidate || nodesValidate.length === 0) {
      setTree([]);
      setLoading(false);
      return null;
    }
    const { nodesTags, externalNodesTags } = await getTags(nodesValidate, externalNodes);
    const txtFiles = nodesValidate.filter((node) => node.data && node.data.ext === 'txt');
    const operationType = type === 'Importacion' ? 1 : 2;
    const response = await getTxtIssues(clientNumber, operationType, txtFiles);
    const { data: issues } = response;
    const issuesNodes = (issues?.with_issues && issuesFile(issues, nodesTags)) || nodesTags;
    setTree(issuesNodes);
    setExternalNode([...externalNodesTags, ...orphanedNodes]);
    const filesResponse = await uploadFiles(files);
    if (Array.isArray(filesResponse)) {
      const {
        nodes: newNode,
        externalNodes: newExternalNodes,
      } = addFilesS3(
        filesResponse as FileData[],
        issuesNodes,
        [...externalNodesTags, ...orphanedNodes],
      );
      return {
        newNode,
        newExternalNodes,
      };
    }
    return null;
  };

  const onSubmit = async ({
    type, client, clientNumber, patente, aduana, comments,
  }: FieldValues, {
    closeDialog,
    refetch,
    sendingCrossing = false,
    showConfirmation,
    updateHistoryCreate,
    onSaveSuccessMessage = t('cruces.onSave.success') as string,
  }: SubmitProps) => {
    const filesTree = tree.map((node) => getFile(node));
    const filesExternal = externalNode.map((node) => getFile(node));
    const filesUpload = [...filesTree, ...filesExternal].filter((file) => file) as FileDropZone[];

    if (!filesUpload || filesUpload.length === 0) {
      setSnackBar('error', 'Los archivos son requeridos');
      return;
    }

    setLoading(true);

    const filesResponse = await uploadFiles(filesUpload);

    let responseMessage: ResponseMessage = {
      type: 'error',
      message: sendingCrossing ? t<string>('cruces.onSend.error') : t<string>('cruces.onSave.error'),
    };

    if (Array.isArray(filesResponse)) {
      const { nodes, externalNodes } = addFilesS3(filesResponse as FileData[]);
      const fileNames = [...externalNodes, ...nodes]
        .map((e) => e.data?.name)
        .filter((e) => Boolean(e)) as string[];

      try {
        const createResponse = await createCrossing({
          variables: {
            crossing: {
              type,
              client,
              clientNumber,
              patente,
              aduana,
              comments,
              nodes: {
                tree: nodes,
                externalNode: externalNodes,
              },
              sendingCrossing,
            },
          },
          context: { clientName: 'globalization' },
        });

        responseMessage = {
          type: 'success',
          message: onSaveSuccessMessage,
        };

        const id = createResponse.data?.createCrossing?.id;
        setSnackBar(responseMessage.type, responseMessage.message);

        const data = {
          closeDialog,
          refetch,
          updateHistoryCreate,
        };
        await validations(data, fileNames, comments, id);
        await crossingsListRefetch(variables);
        setLoading(false);
        return showConfirmation && showConfirmation(id);
      } catch (error) {
        setLoading(false);
        return setSnackBar(responseMessage.type, responseMessage.message);
      }
    }
    setLoading(false);
    return setSnackBar(responseMessage.type, responseMessage.message);
  };

  const onRequestDraftOperation = async ({
    id,
    showConfirmation,
    updateHistory,
    refetch,
  }: RequestDraftOperation) => {
    const fileNames = [...externalNode, ...tree]
      .map((e) => e.data?.name)
      .filter((e) => Boolean(e)) as string[];

    const responseMessage: ResponseMessage = {
      type: 'error',
      message: t<string>('cruces.onSend.error'),
    };

    try {
      const requestDraftOperationResponse = await requestDraftOperation({
        variables: {
          crossingId: id,
        },
        context: { clientName: 'globalization' },
      })
        .catch();

      const newRequestedOperationId = get(requestDraftOperationResponse, 'data.requestDraftOperation.id', '');
      await updateHistory(newRequestedOperationId, fileNames);

      if (refetch) refetch();

      return showConfirmation(newRequestedOperationId);
    } catch (error) {
      if (error instanceof ApolloError) {
        const { i18Key } = get(error.graphQLErrors[0], 'extensions.exception.response', {} as { i18Key: string });
        if (i18Key) return errorMessage(t<string>(`cruces.onSave.${i18Key}`), { horizontal: 'center', vertical: 'top' });
        return errorMessage(error.message);
      }
      return setSnackBar(responseMessage.type, responseMessage.message);
    }
  };

  return {
    loading,
    files,
    tree,
    externalNode,
    setLoading,
    setExternalNode,
    setTree,
    setFiles,
    createNodes,
    getValidateTxt,
    addValidateTxt,
    getTags,
    handleDropTree,
    onSubmit,
    onRequestDraftOperation,
    getTxtIssues,
    issuesFile,
    sortFiles,
    openDialog,
    setOpenDialog,
    uploadFiles,
    addFilesS3,
    addFile,
    validateExitsFile,
    crossingsListRefetch,
    t,
    loadingList,
    crossingsList,
    setStatus,
    status,
    setVariables,
    variables,
  };
};

export default useCruce;
