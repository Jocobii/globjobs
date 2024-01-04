/* eslint-disable sonarjs/cognitive-complexity */
import {
  useState, useContext, useEffect,
} from 'react';
import { getUserSession } from '@gsuite/shared/contexts/AuthContext';
import * as yup from 'yup';
import _, { uniqBy } from 'lodash';
import capitalize from 'lodash/capitalize';
import loadable from '@loadable/component';
import { NotificationsContext } from '@gsuite/shared/contexts/NotificationsContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldValues, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { useUpdateCruceHistory } from '@gsuite/shared/services/cruces/update-history';
import { useValidateFiles } from '@gsuite/shared/services/cruces';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {
  PAID_DOCUMENTS_STATUS,
  FOLDER_OPTIONS,
  DESPACHO_FOLDER,
  PEDIMENTOS_FOLDER,
  ARCHIVOS_GENERALES_FOLDER,
  DOCUMENTS_PROCESS_STATUS,
  PROFORMA_AUTHORIZATION_STATUS,
} from '@gsuite/shared/seeders';
import {
  Dropzone,
  ControlledAutocomplete,
  DialogComponent,
  ControlledTextField,
  FileTagger,
  useDialog,
} from '@gsuite/shared/ui';
import {
  FileDropZone,
  UploadedFile,
  SimpleNode,
  NodeModels,
  RequiredActions,
  ValidateFile,
} from '@gsuite/typings/files';
import { RequiredActionsTypes } from '@gsuite/typings/crossing';

import { useSnackNotification } from '@gsuite/shared/hooks';
import { uploadFiles } from '@gsuite/shared/lib/uploadFile';
import { useTranslation } from 'react-i18next';
import { LoadingButton } from '@mui/lab';
import { useCrossing, Crossing } from '@gsuite/shared/contexts';
import { useAssignUser } from '../services/assign-user';
import { useUpdateCruce } from '../services/cruce-update';
import { getIntegrationNumber } from '../services/integrationNumber';
import { urlIntegration, openNewTab } from '../utils/func';
import ProformaUploader from './ProformaUploader';
import { useCruceDetail } from '../services/cruce-detail';
import { getPedimentoProforma } from '../services/pedimento-proforma';
import useCruce from '../hooks/useCruce';

const DuplicatedFilesDialog = loadable(() => import('@gsuite/shared/ui/cruces/DuplicatedFilesDialog'), { fallback: <p> </p> });

interface Props {
  isOpen: boolean;
  setIsOpen: () => void;
  targetFolder: string;
}

type UploadedSimpleNode = UploadedFile & SimpleNode;
const GENERAL_FOLDER = 'general-folder';

export default function UploadFileToFolder({
  isOpen,
  setIsOpen,
  targetFolder,
}: Props) {
  const { showSnackMessage } = useSnackNotification();
  const [assignUser] = useAssignUser();
  const [step, setStep] = useState(0);
  const [isOnlyTxt, setIsOnlyTxt] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [hasProforma, setHasProforma] = useState<boolean>(false);
  const [hasEntrySummary] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const { setSnackBar } = useContext(NotificationsContext);
  const { t } = useTranslation();
  const { updateHistory } = useUpdateCruceHistory();
  const [openDialog, closeDialog] = useDialog();
  const { crossing, setCrossing } = useCrossing();
  const getPedimentosFolders = () => crossing?.nodes?.tree?.filter(
    (node) => node.droppable,
  ) ?? [];
  const {
    getValidateTxt,
    readTxtFile,
    createNodes,
    addValidateTxt,
    getTxtIssues,
    issuesFile,
    flatTreeNodes,
    removeRepetitionFromFileName,
  } = useCruce();
  const [validatePedimento] = useValidateFiles();
  const pedimentosFolders = targetFolder === 'pedimentos' ? getPedimentosFolders() : [];
  const [file, setFiles] = useState<FileDropZone[]>([]);
  const [valFile, setValFile] = useState<FileDropZone>();
  const [taggersFile, setTaggersFile] = useState<SimpleNode[]>([]);
  const [loading, setLoading] = useState(false);
  const schema = yup.object().shape({
    comments: yup.string().max(150, 'El comentario debe tener como máximo 150 caracteres'),
    ...(targetFolder === 'pedimentos' ? { pedimento: yup.string().required('La carpeta es requerida') } : {}),
  });
  const { updateCrossing } = useUpdateCruce();
  const {
    formState: { errors },
    control,
    register,
    setValue,
    getValues,
  } = useForm<FieldValues>({
    resolver: yupResolver(schema),
  });

  const handleUpdateHistory = async (files: string[], action: string, comments?: string) => {
    await updateHistory({
      variables: {
        operation: {
          id: crossing?.id,
          action,
          files,
          ...(comments && { comments }),
        },
      },
      context: { clientName: 'globalization' },
    });
  };

  /**
   * avoid file tagging when the user uploads only .txt files
   */
  useEffect(() => {
    if (
      (file.length === 1 && file[0].name.includes('.txt'))
      || (file.length > 1 && file.every((f) => f.name.includes('.txt')))
    ) {
      setIsOnlyTxt(true);
    } else {
      setIsOnlyTxt(false);
    }
  }, [file]);

  const handleClose = (fullExit = false) => {
    setTaggersFile([]);
    setFiles([]);
    setHasProforma(false);
    setValue('comments', '');
    setValFile(undefined);
    setLoading(false);
    if (fullExit) setIsOpen();
    setStep(0);
  };

  const getFolderSelected = () => FOLDER_OPTIONS
    .find((folder) => folder.key === targetFolder) ?? {};

  const fileToNode = (
    fileUploaded: UploadedFile & SimpleNode,
    parent = '0',
    integrationNumber?: string,
    pedimentoNumber?: string,
  ) => {
    const isProforma = (fileUploaded?.tags && fileUploaded?.tags?.toLowerCase()?.includes('proforma')) || false;
    const isEntrySummary = (fileUploaded?.tags && fileUploaded?.tags?.toLowerCase()?.includes('autorización de impuestos (us)')) || false;
    const hasRequiredActions = isProforma || isEntrySummary;
    return {
      id: fileUploaded.key,
      parent: parent === '' ? '0' : parent.toString(),
      droppable: false,
      text: fileUploaded.key,
      data: {
        ext: fileUploaded.name ? fileUploaded?.name?.split('.')[1] : fileUploaded.key.split('.')[1],
        ...!Number(fileUploaded?.name?.split('.')[1]) && { firstDigitized: fileUploaded.firstDigitized },
        file: {
          name: fileUploaded.name,
          key: fileUploaded.name,
          url: fileUploaded.url,
        },
        name: fileUploaded.key,
        ...(fileUploaded.tags && {
          tags: fileUploaded.tags,
        }),
        ...(hasRequiredActions && {
          tags: capitalize(fileUploaded?.tags), // force capitalize to trigger step 2
        }),
        ...(hasRequiredActions && {
          pendingAuthorization: true,
          pedimentoNumber: pedimentoNumber?.toString(),
        }),
        ...(hasRequiredActions && amount >= 0 && {
          authorizedCashAmount: amount,
        }),
        ...integrationNumber && { integrationNumber: integrationNumber.toString() },
      },
    };
  };

  const { refetch } = useCruceDetail(crossing?.id as string);
  const setUser = async () => {
    const getUser = await getUserSession();
    if (getUser?.user?.id !== crossing?.user?.id) {
      await assignUser({
        variables: {
          crossingId: crossing?.id,
          userId: getUser?.user?.id,
        },
      });
    }
  };

  const nodeToUpdate = (uploadedFile: UploadedSimpleNode[], pedimento = '', integrationNumber = '', pedimentoNumber = '') => {
    if (targetFolder === ARCHIVOS_GENERALES_FOLDER) {
      return {
        externalNode: [
          ...crossing?.nodes?.externalNode ?? [],
          ...uploadedFile.map((fileUploaded) => fileToNode(
            fileUploaded,
            GENERAL_FOLDER,
            integrationNumber,
            pedimentoNumber,
          )),
        ],
      };
    }

    if (targetFolder === PEDIMENTOS_FOLDER) {
      return {
        tree: [
          ...crossing?.nodes?.tree ?? [],
          ...uploadedFile.map((fileUploaded) => fileToNode(
            fileUploaded,
            pedimento,
            integrationNumber,
            pedimentoNumber,
          )),
        ],
      };
    }

    if (targetFolder === DESPACHO_FOLDER) {
      let lastFileNode = crossing?.nodes?.dispatchFileNode ?? [];
      if (uploadedFile.find((e) => e.tags === 'DODA / PITA')?.tags) {
        lastFileNode = lastFileNode.filter(
          (node) => node.id !== 'dispatch-folder-dummy',
        ) || [];
      }
      return {
        dispatchFileNode: [
          ...lastFileNode ?? [],
          ...uploadedFile.map((fileUploaded) => fileToNode(
            fileUploaded,
            'dispatch-folder',
            integrationNumber,
          )),
        ],
      };
    }
    return [];
  };

  const mappFileByFolder = (
    uploadedFile: UploadedSimpleNode [],
    pedimento = '',
    integrationNumber = '',
    pedimentoNumber = '',
  ) => ({
    ...crossing,
    nodes: {
      ...crossing?.nodes,
      ...nodeToUpdate(uploadedFile, pedimento, integrationNumber, pedimentoNumber),
    },
  }) as Crossing;

  const createRequiredActions = (
    treeNodes?: NodeModels[],
    actualRequiredActions: RequiredActions[] = [],
  ): RequiredActions[] | [] => {
    if (!treeNodes || treeNodes.length < 1) return actualRequiredActions ?? [];
    const filesActions = treeNodes?.filter((n) => !!n.data?.pendingAuthorization);
    const pendingFiles = filesActions?.filter(
      (n) => actualRequiredActions?.findIndex((ra) => ra.fileNodeId === n.id) < 0,
    );
    const pendingAuthorizationFile = pendingFiles.length > 0 ? pendingFiles[0] : null;

    if (!pendingAuthorizationFile) return actualRequiredActions ?? [];

    const newRequiredAction: RequiredActions = {
      fileNodeId: pendingAuthorizationFile.id as string,
      name: 'pendingAuthorization',
      resolved: false,
      nameFile: pendingAuthorizationFile.data?.file?.name as string,
      type: pendingAuthorizationFile.data?.tags?.toLowerCase()?.includes('proforma') ? RequiredActionsTypes.PROFORMA : RequiredActionsTypes.TAXES,
    };

    if (Array.isArray(actualRequiredActions) && actualRequiredActions?.length > 0) {
      const requiredActionAlreadyExists = actualRequiredActions.some(
        (ra) => (
          (ra.nameFile === pendingAuthorizationFile.data?.file?.name)
          && (ra.fileNodeId === pendingAuthorizationFile.id)
        ),
      );
      if (requiredActionAlreadyExists) return actualRequiredActions ?? [];
      return [...actualRequiredActions, newRequiredAction];
    }

    return [newRequiredAction];
  };

  const canSetPedimentoPagadoStatus = (currentCrossing: Crossing) => {
    const allFiles = [
      ...currentCrossing?.nodes?.dispatchFileNode ?? [],
      ...currentCrossing?.nodes?.tree ?? [],
      ...currentCrossing?.nodes?.externalNode ?? [],
    ];

    const { _id: id } = currentCrossing.status ?? {};
    if (![DOCUMENTS_PROCESS_STATUS, PROFORMA_AUTHORIZATION_STATUS].includes(id ?? '')) return false;
    return allFiles.some((e) => e?.data?.tags?.toLowerCase() === 'pedimento pagado');
  };

  const handleUpdateCrossing = async (newCrossing: Crossing, finalFiles: UploadedSimpleNode[]) => {
    const newRequiredActions = createRequiredActions(
      targetFolder === ARCHIVOS_GENERALES_FOLDER
        ? newCrossing.nodes?.externalNode
        : newCrossing.nodes?.tree,
      newCrossing.requiredActions,
    );

    const crossing1: Crossing = {
      ...newCrossing,
      ...(newRequiredActions && newRequiredActions?.length > 0 && {
        requiredActions: newRequiredActions,
      }),
    };
    const canSetPedimentoPagado = canSetPedimentoPagadoStatus(crossing1);
    try {
      if (crossing?.id) {
        await updateCrossing({
          variables: {
            crossing: {
              ...crossing1,
              ...(canSetPedimentoPagado && {
                status: {
                  _id: PAID_DOCUMENTS_STATUS,
                  name: 'Documentos pagados',
                  color: '',
                },
              }),
              sentDarwin: false,
            },
          },
          context: { clientName: 'globalization' },
          onCompleted: async () => {
            if (finalFiles.length > 0) {
              const {
                comments,
              } = getValues();
              await updateHistory({
                variables: {
                  operation: {
                    id: crossing?.id,
                    action: canSetPedimentoPagado ? 'paid_documents' : 'update_file',
                    files: finalFiles.map((myFile) => myFile.name || myFile.key),
                    comments,
                  },
                },
                context: { clientName: 'globalization' },
              });
              await setUser();
              refetch();
            }
          },
        });
      }
      if (finalFiles.length > 0) setSnackBar('success', t('cruces.file_added'));
    } catch (error) {
      setSnackBar('error', t('cruces.file_not_added'));
    }
  };

  const mapNodesS3Props = (filesResponse: UploadedSimpleNode [], nodes: NodeModels[]) => nodes
    .map((n) => {
      const nodeData = filesResponse.find((f) => n.data?.name === f.name);
      if (nodeData) {
        const currentNode = { ...n };
        delete currentNode.data?.delete;
        delete currentNode.data?.file;
        delete currentNode.data?.extraData;

        return {
          ...currentNode,
          data: {
            ...currentNode.data,
            ...(nodeData?.tags && {
              tags: nodeData?.tags,
            }),
            ...(nodeData?.firstDigitized && {
              firstDigitized: nodeData?.firstDigitized,
            }),
            name: nodeData.name,
            file: {
              url: nodeData.url,
              key: nodeData.name,
              name: nodeData.name,
            },
          },
        };
      }

      return n;
    });

  const findIndexToRemove = (fileName: string, ext: string, nodes?: NodeModels[]): number => {
    if (!nodes || (Array.isArray(nodes) && nodes.length < 1)) {
      return -1;
    }
    return nodes.findIndex(
      (n) => n.data?.file?.name.includes(fileName) && n.data.ext?.includes(ext),
    );
  };

  const createUniqTreeNodes = (newCrossingNodesTree: NodeModels[] = []) => {
    if (!newCrossingNodesTree || newCrossingNodesTree.length < 1) return [];

    const uniqFolders = _.uniqBy(newCrossingNodesTree.filter((n) => n.parent === '0') || [], 'text').map((n) => ({ ...n })) || [];
    const uniqFiles = uniqBy(newCrossingNodesTree.filter((n) => n.parent !== '0' && n.data?.file) || [], (f) => f.data?.file?.name) || [];
    return uniqFolders.concat(uniqFiles) || [];
  };

  const handleSubmit = async () => {
    const { pedimento, comments } = getValues();
    if (taggersFile.length === 0 && !isOnlyTxt) {
      setSnackBar('error', t('cruces.file_not_selected'));
      return;
    }

    const dodaFile = taggersFile.find((e) => e.tags === 'DODA / PITA');
    const proformaFile = taggersFile.find((e) => e.tags === 'Proforma');
    const dodaTargetFile = file.find((f) => f.name.includes(dodaFile?.name as string));
    if (dodaFile?.tags && dodaTargetFile?.type !== 'application/pdf') {
      setSnackBar('error', t('cruces.file_not_pdf'));
      return;
    }

    setLoading(true);

    const filesToUpload = valFile ? [...file, valFile] : file;

    const data = await new Promise((resolve) => {
      const txtFiles = filesToUpload.filter((f) => f.name.toLowerCase().includes('.txt'));
      const promises = txtFiles.map((f) => readTxtFile(f, crossing as FieldValues));
      Promise.all(promises).then((values) => {
        resolve(values);
      });
    });
    if (Array.isArray(data) && data?.length > 0) {
      const someError = data.some((d) => d?.error);
      if (someError) {
        setLoading(false);
        return;
      }
    }
    const currentCrossingFiles = flatTreeNodes(crossing?.nodes);
    const duplicatedFiles: FileDropZone[] = [];

    filesToUpload.forEach((fileToUpload) => {
      const { name } = fileToUpload;
      const [originalName, ext] = name.split('.');

      const duplicatedFile = currentCrossingFiles.find(
        (df) => ((df.text === originalName || df.data?.file?.name === originalName)
        || (df.text === name || df.data?.file?.name === name)
        || (
          removeRepetitionFromFileName(df?.text as string) === originalName
          || removeRepetitionFromFileName(df.data?.file?.name as string) === originalName
        ) || (
          removeRepetitionFromFileName(df?.text as string) === name
          || removeRepetitionFromFileName(df.data?.file?.name as string) === name
        ))
          && df.data?.ext === ext,
      );

      if (duplicatedFile) duplicatedFiles.push(fileToUpload);
    });

    if (duplicatedFiles.length > 0) {
      const preTaggedFiles = taggersFile.map((tgf) => ({
        ..._.pick(tgf, ['firstDigitized', 'name', 'tags']),
        ...(tgf.tags.toLowerCase().includes('proforma') && {
          authorizedCashAmount: amount ?? 0,
        }),
      })) ?? [];

      const allDuplicatedTxtFiles = duplicatedFiles
        .filter((x) => String(x?.name).toLowerCase().split('.')[1] === 'txt') || [];

      const allDuplicatedInvoiceFiles = duplicatedFiles
        .filter((f) => preTaggedFiles.find(
          (x) => String(x.name).includes(f.name) && String(x?.tags).toLowerCase() === 'factura',
        )) || [];

      openDialog({
        children: (
          <DuplicatedFilesDialog
            t={t}
            hasRelatedFiles={[
              ...allDuplicatedTxtFiles,
              ...allDuplicatedInvoiceFiles,
            ].length > 0}
            crossingId={_.get(crossing, 'id', '')}
            onClose={closeDialog}
            pedimento={pedimento}
            comments={comments}
            files={filesToUpload ?? []}
            updateHistory={handleUpdateHistory}
            refetch={refetch}
            showMessage={showSnackMessage as (message: string, type: string) => void}
            openTab={(integrationNumber: string) => openNewTab(urlIntegration(integrationNumber))}
            targetFolder={targetFolder}
            preTaggedFiles={preTaggedFiles}
          />
        ),
      });

      handleClose(true);
      return;
    }

    const response = await uploadFiles(filesToUpload);
    const fileUploaded = response as unknown as UploadedFile[];

    let integrationNumber = '';
    let pedimentoNumber = '';

    if (dodaFile?.tags) {
      try {
        const uploadDodaPita = fileUploaded.find((e) => e.key === dodaFile.name);
        if (!uploadDodaPita) return;
        integrationNumber = await getIntegrationNumber(uploadDodaPita.key, crossing?.id ?? '');
      } catch {
        setLoading(false);
        setSnackBar('error', t('cruces.integration_number_not_found'));
        return;
      }
    }

    if (proformaFile?.tags) {
      const uploadProforma = fileUploaded.find((e) => e.key === proformaFile.name);
      if (uploadProforma) {
        pedimentoNumber = await getPedimentoProforma(uploadProforma.key, crossing?.id ?? '').catch(() => '');
      }
    }

    const finalFiles: UploadedSimpleNode [] = fileUploaded.map((e) => {
      const tagger = taggersFile.find((taggedFile) => taggedFile.name === e.key) || {};
      return {
        ...e,
        ...tagger,
      } as UploadedSimpleNode;
    });

    const newCrossing = mappFileByFolder(
      finalFiles,
      pedimento,
      integrationNumber,
      pedimentoNumber,
    );

    if (dodaFile) {
      openNewTab(urlIntegration(integrationNumber));
    }

    if (targetFolder === ARCHIVOS_GENERALES_FOLDER) {
      const {
        type,
        aduana,
        patente,
        clientNumber,
        nodes: oldNodes,
      } = newCrossing;

      const { nodes } = await createNodes(
        file,
        oldNodes!.tree as NodeModels[] || [],
        oldNodes!.externalNode as NodeModels[] || [],
        {
          type, aduana, patente, clientNumber,
        },
      );

      const validation = getValidateTxt(
        nodes,
        aduana ?? '',
        patente ?? '',
        clientNumber ?? '',
        type ?? '',
      ) as unknown;

      const { data: fileValidate } = await validatePedimento({
        variables: {
          validateFiles: validation,
        },
      });

      const { validatePedimento: arrayValidate } = fileValidate;
      const nodesValidateDarwin = arrayValidate.filter((node: ValidateFile) => node.data);
      const filesToDelete = arrayValidate
        .filter((node: ValidateFile) => !node.validated && !node.data)
        .filter((node: ValidateFile) => {
          const fileName = String(node.fileId).split(',')[1];
          const fileHasBeenUploaded = finalFiles.findIndex(
            (n) => String(n.name).includes(fileName) && (String(n.key).includes('txt') || (String(n.name).includes('txt'))),
          );
          return fileHasBeenUploaded >= 0;
        }) || [];

      const fileNamesToDelete: string[] = [];
      if (filesToDelete && filesToDelete.length > 0) {
        filesToDelete.forEach((f: Partial<Pick<ValidateFile, 'fileId'>>) => {
          const fileName = f?.fileId?.split(',')[1] ?? '';
          if (fileName) fileNamesToDelete.push(fileName);
        });
      }
      const {
        nodesValidate,
      } = addValidateTxt(nodesValidateDarwin, nodes, newCrossing.nodes?.tree ?? []);
      const txtFiles = nodesValidate.filter((node: NodeModels) => node.data && node.data.ext === 'txt');
      const getTxtIssuesResponse = await getTxtIssues(clientNumber ?? '', Number(type), txtFiles);
      const { data: issues } = getTxtIssuesResponse;
      const issuesNodes = (issues?.with_issues && issuesFile(issues, nodesValidate))
        || nodesValidate;

      const nodesWithS3Props = _.uniqBy(mapNodesS3Props(finalFiles, issuesNodes) || [], 'id') || [];
      nodesWithS3Props.forEach((n) => {
        const currentNodeIndex = newCrossing?.nodes
          ?.externalNode?.findIndex((en) => n.data?.file?.key === en.data?.file?.key);
        if (currentNodeIndex && currentNodeIndex >= 0) {
          newCrossing.nodes?.externalNode?.splice(currentNodeIndex, 1);
        }
      });
      if (Array.isArray(nodesWithS3Props) && nodesWithS3Props.length > 0) {
        oldNodes?.tree?.forEach((n) => {
          const reAddNode = nodesWithS3Props
            .findIndex((ns3) => ns3.data?.file?.name === (n?.data?.file?.name ?? '')) < 0;
          if (reAddNode) nodesWithS3Props.push(n);
        });

        const newCrossingNodesTree = [
          ...newCrossing.nodes?.tree as NodeModels[],
          ...nodesWithS3Props,
        ] as NodeModels[];

        newCrossing.nodes = {
          ...newCrossing.nodes,
          tree: createUniqTreeNodes(newCrossingNodesTree),
        };

        fileNamesToDelete.forEach((fileName) => {
          const existingNewExternalTxtIndex = findIndexToRemove(fileName, 'txt', newCrossing.nodes?.externalNode);
          const existingOldExternalTxtIndex = findIndexToRemove(fileName, 'txt', crossing?.nodes?.externalNode);
          if (existingNewExternalTxtIndex >= 0 && existingOldExternalTxtIndex < 0) {
            newCrossing.nodes?.externalNode?.splice(existingNewExternalTxtIndex, 1);
          }

          const existingNewExternalPdfIndex = findIndexToRemove(fileName, 'pdf', newCrossing.nodes?.externalNode);
          const existingOldExternalPdfIndex = findIndexToRemove(fileName, 'pdf', crossing?.nodes?.externalNode);
          if (existingNewExternalPdfIndex >= 0 && existingOldExternalPdfIndex < 0) {
            newCrossing.nodes?.externalNode?.splice(existingNewExternalPdfIndex, 1);
          }

          const existingNewTreePdfIndex = findIndexToRemove(fileName, 'pdf', newCrossing.nodes?.tree);
          const existingOldTreePdfIndex = findIndexToRemove(fileName, 'pdf', crossing?.nodes?.tree);
          if (existingNewTreePdfIndex >= 0 && existingOldTreePdfIndex < 0) {
            newCrossing.nodes?.tree?.splice(existingNewTreePdfIndex, 1);
          }

          const existingFinalFileTxtIndex = finalFiles.findIndex((f) => (f.name.includes(fileName) || f.key.includes(fileName)) && (f.name.includes('txt')));
          const existingFinalFilePdfIndex = finalFiles.findIndex((f) => (f.name.includes(fileName) || f.key.includes(fileName)) && (f.name.includes('pdf')));
          if (existingFinalFileTxtIndex >= 0) finalFiles.splice(existingFinalFileTxtIndex, 1);
          if (existingFinalFilePdfIndex >= 0) finalFiles.splice(existingFinalFilePdfIndex, 1);
        });
      }
    }
    if (!newCrossing.nodes?.externalNode?.find(
      (n) => String(n.id).toLowerCase() === GENERAL_FOLDER,
    )) {
      newCrossing.nodes = {
        ...newCrossing.nodes,
        externalNode: [
          {
            id: GENERAL_FOLDER,
            text: 'Archivos Generales',
            parent: '0',
            droppable: true,
            data: undefined,
          },
          ...newCrossing.nodes?.externalNode ?? [],
        ],
      };
    }

    setCrossing({ ...newCrossing, sentDarwin: false });
    await handleUpdateCrossing(newCrossing, finalFiles);
    setLoading(false);
    setFiles([]);
    handleClose(true);
  };

  return (
    <Container>
      <DialogComponent
        maxWidth="lg"
        open={isOpen}
        handleClose={() => {
          handleClose(true);
          setStep(0);
          setHasProforma(false);
          setDisabled(true);
        }}
        okButtonVisibility={false}
        cancelButtonVisibility={false}
        title={t('cruces.addFile')}
      >
        {
          step === 0 ? (
            <form>
              <DialogContent>
                <Box sx={{ width: '100%' }}>
                  <Stack spacing={2}>
                    <Dropzone
                      label={t('ui.file')}
                      files={file}
                      filesSetter={setFiles}
                    />
                    {targetFolder === PEDIMENTOS_FOLDER ? (
                      <ControlledAutocomplete
                        errors={errors}
                        name="pedimento"
                        label={t('cruces.pedimento_destination')}
                        control={control}
                        defaultValue={() => {
                          setValue('pedimento', pedimentosFolders[0]?.id ?? '');
                          return pedimentosFolders.length === 1 ? pedimentosFolders[0] : null;
                        }}
                        options={pedimentosFolders}
                        key="folder-autocomplete"
                        optionLabel={({ text }: { text: string }) => text || ''}
                        valueSerializer={({ id }: { id: string }) => id || ''}
                      />
                    ) : null}
                    {
                      targetFolder === PEDIMENTOS_FOLDER ? null : (
                        <ControlledAutocomplete
                          errors={errors}
                          name="folder"
                          disabled
                          label={t('cruces.destination_folder')}
                          control={control}
                          options={FOLDER_OPTIONS}
                          key="folder-autocomplete"
                          optionLabel={({ name }: { name: string }) => name}
                          valueSerializer={({ name }: { name: string }) => name}
                          defaultValue={getFolderSelected}
                        />
                      )
                    }
                    <ControlledTextField
                      label={t('cruces.history.aditionalComments')}
                      register={register}
                      inputType="text"
                      errors={errors}
                      fieldName="comments"
                      key="comments-keys"
                    />
                  </Stack>
                </Box>
              </DialogContent>
            </form>
          ) : <p> </p>
        }
        {
          step === 1 ? (
            <DialogContent>
              <FileTagger
                files={file.filter((f) => !f.name.includes('txt'))}
                getTaggerFiles={setTaggersFile}
                setHasProforma={setHasProforma}
                setDisabled={setDisabled}
              />
            </DialogContent>
          ) : <p> </p>
        }
        {
          step === 2 ? (
            <DialogContent>
              <ProformaUploader
                setDisabled={setDisabled}
                setValFile={setValFile}
                setAmount={setAmount}
                addFile={hasEntrySummary}
              />
            </DialogContent>
          ) : <p> </p>
        }
        <DialogActions>
          <Button
            sx={{ borderRadius: 5 }}
            variant="outlined"
            onClick={() => {
              setHasProforma(false);
              setDisabled(true);
              handleClose(true);
            }}
          >
            {t('cancel')}
          </Button>
          {
            step === 1 && (
              <Button
                sx={{ borderRadius: 5 }}
                variant="outlined"
                onClick={() => {
                  setHasProforma(false);
                  setDisabled(true);
                  setStep(step - 1);
                }}
              >
                {t('prev')}
              </Button>
            )
          }
          <LoadingButton
            onClick={() => {
              if (step === 2 || (step === 1 && !hasProforma) || isOnlyTxt) {
                return handleSubmit();
              }
              return setStep(step + 1);
            }}
            loading={loading}
            disabled={step === 0 ? file.length === 0 : disabled}
            sx={{ borderRadius: 5 }}
            variant="contained"
            type="submit"
          >
            Siguiente
          </LoadingButton>
        </DialogActions>
      </DialogComponent>
    </Container>
  );
}
