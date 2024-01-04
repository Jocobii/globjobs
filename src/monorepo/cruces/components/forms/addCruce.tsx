import {
  useEffect,
  useState,
} from 'react';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { NodeModels } from '@gsuite/typings/files';
import { isBoolean, isEqual } from 'lodash';
import {
  DialogContent,
  Grid,
  MenuItem,
  Stack,
  DialogActions,
  Button,
  useTheme,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {
  ControlledAutocomplete, ControlledSelect, ControlledTextField, Dropzone,
} from '@gsuite/shared/ui';
import loadable from '@loadable/component';
import { useGetOneCompany } from '@gsuite/shared/services/cruces/get-one-company';
import { useUpdateCruceHistory } from '@gsuite/shared/services/cruces/update-history';
import {
  useValidateFiles,
  useValidateTxT,
  useUpdateTxT,
  ValidateTxT,
} from '@gsuite/shared/services/cruces';
import { useCrossing, defaultState } from '@gsuite/shared/contexts';
import useCruce from '../../hooks/useCruce';
import { useFindCompany } from '../../services/findCompany';
import Loading from '../Loading';
import TreeList from '../TreeList';
import AddFilesMenu from '../AddFilesMenu';
import ConfirmSendOperation from '../ConfirmSendOperation';
import useTeamByClient from '../../services/team-by-client';

const AREA_CE = '64f8a55f4960056b0eedcb7a';

const DialogValidate = loadable(() => import('../DialogValidate'), { fallback: <p> </p> });

type Props = {
  closeDialog: () => void;
  refetch: () => void;
};

const crossingType = ['Importacion', 'Exportacion'];
const trafficType = ['maritimo', 'terrestre'];

const GENERIC_MESSAGE = 'generic.requiredField';
export default function AddCruce({
  closeDialog, refetch,
}: Props) {
  const { t } = useTranslation();
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = !!anchorEl;
  const { updateHistory } = useUpdateCruceHistory();
  const [updateTxT] = useUpdateTxT();
  const {
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
    getTxtIssues,
    issuesFile,
    removeNodesDeleted,
    handleUpdateTxtFiles,
  } = useCruce();
  const theme = useTheme();
  const color = theme.palette.mode === 'light' ? '#000' : '#fff';
  const [validatePedimento] = useValidateFiles();
  const { debouncedCompany, data } = useFindCompany();
  const { crossing, setCrossing, dialogData } = useCrossing();
  const schema = yup.object().shape({
    trafficType: yup.string().required(t(GENERIC_MESSAGE)),
    type: yup.string().required(t(GENERIC_MESSAGE)),
    customerUser: yup.object().shape({
      _id: yup.string().required(t(GENERIC_MESSAGE)),
      name: yup.string().required(t(GENERIC_MESSAGE)),
      lastName: yup.string().required(t(GENERIC_MESSAGE)),
    }).required(t(GENERIC_MESSAGE)),
    team: yup.string().required(t(GENERIC_MESSAGE)),
    client: yup.string().required(t(GENERIC_MESSAGE)),
    clientNumber: yup.string().required(t(GENERIC_MESSAGE)),
    patente: yup.string().required(t(GENERIC_MESSAGE)).length(4, t('cruces.onSave.patentLength')),
    aduana: yup.string().required(t(GENERIC_MESSAGE)).length(3, t('cruces.onSave.aduanaLength')),
    comments: yup.string(),
  });

  const { findOneCompany, data: companyUsers } = useGetOneCompany();
  const [checkCrossing] = useValidateTxT();
  const {
    register,
    getValues,
    setValue,
    formState: { errors, isValid },
    control,
    watch,
    resetField,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
  });
  const number = getValues('clientNumber');

  watch('clientNumber');

  const { teamByClient } = useTeamByClient({
    areaId: AREA_CE,
    number,
  });

  const updateHistoryCreate = async (id: string, allFiles: string[], comments: string) => {
    await updateHistory({
      variables: {
        operation: {
          id,
          action: 'request',
          files: allFiles,
          comments,
        },
      },
      context: { clientName: 'globalization' },
    });
    await checkCrossing({
      variables: {
        crossingId: id,
      },
    })
      .then(async (res) => {
        if (crossing?.isWithoutTxtFlow || crossing?.nodes?.tree?.length === 0) return true;
        const {
          isValid: isValidCheck,
          plates,
          economic,
          country,
        } = res.data?.checkCrossing as ValidateTxT;
        if (isValidCheck) {
          await updateTxT({
            variables: {
              data: {
                id,
                plate: plates[0],
                economic: economic[0],
                country: country[0],
              },
            },
          });
          return data?.updatedTxtFiles;
        }
        return false;
      });
  };

  const isWithoutTxtFlow = (externalNodes: NodeModels[]) => {
    const isWithoutTxt = externalNodes.find((node: NodeModels) => node?.data?.tags === 'Factura' || node?.data?.firstDigitized);
    return !!isWithoutTxt;
  };

  const getSubmitHandler = (sendingCrossing: boolean) => {
    const submitProps: Parameters<typeof onSubmit>[1] = {
      sendingCrossing,
      closeDialog,
      refetch,
    };
    submitProps.updateHistoryCreate = updateHistoryCreate;
    return async () => {
      const submitData = await onSubmit({ ...crossing, ...getValues() }, submitProps);
      // Agregar validacion por si hay error no limpiar el state
      await setCrossing(submitData === 'error' ? crossing! : defaultState);
    };
  };
  const arrayUsers = companyUsers?.companyGetOneByNumber?.users;

  useEffect(() => {
    const newNodes = async () => {
      const {
        type, aduana, patente, clientNumber, customerUser,
      } = getValues();
      const formValues = {
        type, aduana, patente, clientNumber, customerUser,
      };

      const { nodes, externalNodes } = await createNodes(files, tree, externalNode, formValues);
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
      if ((!nodesValidate || nodesValidate.length === 0) && externalNodes.length === 0) {
        setTree([]);
        setLoading(false);
        return;
      }
      const { nodes: cleanNodes } = removeNodesDeleted(nodesValidate);
      const { nodesTags, externalNodesTags } = await getTags(cleanNodes, externalNodes);

      const txtFiles = nodesValidate.filter((node: any) => node.data && node.data.ext === 'txt');
      const operationType = type === 'Importacion' ? 1 : 2;
      const response = await getTxtIssues(clientNumber, operationType, txtFiles);
      const { data: issues } = response;
      const issuesNodes = (issues?.with_issues && issuesFile(issues, nodesTags)) || nodesTags;
      const finalExternalNodes = [...externalNodesTags, ...orphanedNodes];
      setTree(issuesNodes);
      setExternalNode(finalExternalNodes);
      setCrossing({
        ...getValues(),
        nodes: {
          tree: issuesNodes,
          externalNode: finalExternalNodes,
        },
        isWithoutTxtFlow: issuesNodes.length > 0 ? false : isWithoutTxtFlow(finalExternalNodes),
      });
      setLoading(false);
    };
    if (files.length > 0) {
      setLoading(true);
      newNodes();
      setFiles([]);
    }
  }, [files]);

  useEffect(() => {
    if (!crossing) return;
    if (crossing.nodes?.tree?.length) {
      setTree((prevTree) => {
        if (isEqual(prevTree, crossing.nodes?.tree)) {
          return prevTree;
        }
        return crossing.nodes?.tree ?? [];
      });
    }

    if (crossing?.nodes?.externalNode?.length) {
      setExternalNode((prevExternalNode) => {
        if (isEqual(prevExternalNode, crossing.nodes?.externalNode)) {
          return prevExternalNode;
        }
        return crossing.nodes?.externalNode ?? [];
      });
    }
  }, [crossing?.nodes?.tree, crossing?.nodes?.externalNode]);

  useEffect(() => {
    setCrossing({
      ...crossing,
      nodes: {
        ...crossing?.nodes,
        tree,
        externalNode,
      },
    });
  }, [externalNode, tree]);

  useEffect(() => {
    if (teamByClient?.length === 1) {
      setValue('team', teamByClient[0]?.id);
    }
  }, [teamByClient]);

  const hasUploadedFiles: boolean = ( // exclude parent folder
    tree?.filter((n: NodeModels) => n.parent !== '0')?.length > 0
    || externalNode?.filter((n: NodeModels) => n.parent !== '0')?.length > 0
  ) || false;

  const handleClose = () => {
    closeDialog();
  };

  return (
    <form id="add-cruce">
      <AddFilesMenu
        setAnchorEl={setAnchorEl}
        open={open}
        anchorEl={anchorEl}
        theme={theme}
        key="files-menu"
      />
      <DialogContent>
        <Grid
          container
          spacing={2}
          sx={{
            padding: 0,
          }}
        >
          <Grid item lg={4} md={4} sm={4} xs={4}>
            <Stack spacing={3} sx={{ pt: 1 }}>
              <ControlledSelect
                name="trafficType"
                label="Tipo de tráfico"
                control={control}
                defaultValue=""
                key="importTrafficType-select"
                disabled={hasUploadedFiles}
                errors={errors}
              >
                {trafficType.map((cruceType) => (
                  <MenuItem key={cruceType} value={cruceType} style={{ color }}>
                    {cruceType}
                  </MenuItem>
                ))}
              </ControlledSelect>
              <ControlledSelect
                name="type"
                label="Tipo de operacion"
                control={control}
                defaultValue=""
                key="importType-select"
                disabled={hasUploadedFiles}
                errors={errors}
              >
                {crossingType.map((cruceType) => (
                  <MenuItem key={cruceType} value={cruceType} style={{ color }}>
                    {cruceType}
                  </MenuItem>
                ))}
              </ControlledSelect>
              <ControlledAutocomplete
                errors={errors}
                name="client"
                label="Cliente"
                control={control}
                options={data?.companiesFind ?? []}
                key="customer-autocomplete"
                optionLabel={(clientValue: { name: string, number: string }) => {
                  if (clientValue) {
                    return `${clientValue?.number} - ${clientValue?.name}`;
                  }
                  return null;
                }}
                valueSerializer={(clientValue: { name: string, number: string }) => {
                  if (clientValue) {
                    setValue('clientNumber', clientValue?.number);
                    return clientValue?.name;
                  }
                  return null;
                }}
                onSelect={(value) => {
                  // clear customerUser field
                  setValue('customerUser', {
                    _id: '', name: '', lastName: '',
                  });
                  // clear team field
                  resetField('customerUser');
                  if (!value?.includes('-')) return;
                  const sapNumber = value.split('-')[0].trim();
                  findOneCompany(sapNumber);
                }}
                customOnChange={(value) => {
                  debouncedCompany(value);
                }}
              />
              <ControlledAutocomplete
                errors={errors}
                name="customerUser"
                label="Solicitante"
                control={control}
                options={arrayUsers ?? []}
                key="cliente-autocomplete"
                optionLabel={(user: { name: string, lastName: string }) => {
                  if (arrayUsers?.length === 0) return '';
                  if (user) {
                    return `${user?.name} ${user?.lastName}`;
                  }
                  return null;
                }}
                valueSerializer={(user: { name: string, lastName: string }) => {
                  if (user) {
                    setValue('customerUser', user as any);
                    return user;
                  }
                  return null;
                }}
              />
              {teamByClient?.length > 1 && (
                <ControlledSelect
                  name="team"
                  label="Equipo"
                  control={control}
                  defaultValue={teamByClient[0]?.id}
                  key="importType-select"
                  disabled={!number || !teamByClient}
                  errors={errors}
                >
                  {teamByClient?.map(({ id, name }) => (
                    <MenuItem key={id} value={id} style={{ color }}>
                      {name}
                    </MenuItem>
                  ))}
                </ControlledSelect>
              )}
              <Stack spacing={3} sx={{ pt: 1 }} direction="row">
                <ControlledTextField
                  label="Patente"
                  register={register}
                  inputType="text"
                  errors={errors}
                  fieldName="patente"
                  key="patente-field"
                />
                <ControlledTextField
                  label="Aduana"
                  register={register}
                  inputType="text"
                  errors={errors}
                  fieldName="aduana"
                  key="aduana-field"
                />
              </Stack>
              <Dropzone
                label="Archivos"
                files={files}
                disabled={!isValid}
                filesSetter={setFiles}
              />
              <ControlledTextField
                label="Comentarios"
                register={register}
                inputType="text"
                errors={errors}
                fieldName="comments"
                key="comments-field"
              />
            </Stack>
          </Grid>
          <Grid item lg={8} md={8} sm={8} xs={8}>
            {loading && (
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{ height: '400px', width: '100%' }}
              >
                <Loading />
              </Grid>
            )}
            {(tree.length > 0 || externalNode.length > 0) && !loading && (
              <TreeList
                tree={tree}
                externalNode={externalNode}
                handleDropTree={handleDropTree}
              />
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          onClick={handleClose}
        >
          Cancelar
        </Button>
        <LoadingButton variant="contained" onClick={() => setConfirmModal(!confirmModal)} loading={loading}>
          Enviar Operación
        </LoadingButton>
      </DialogActions>
      <ConfirmSendOperation
        loading={loading}
        open={confirmModal}
        handleClose={() => setConfirmModal(!confirmModal)}
        handleSubmit={getSubmitHandler(true)}
      />
      <DialogValidate
        open={isBoolean(dialogData?.isValid) ? !dialogData?.isValid : false}
        handleConfirm={handleUpdateTxtFiles}
        plates={dialogData?.plates ?? []}
        economics={dialogData?.economic ?? []}
        countrys={dialogData?.country ?? []}
        closeView={false}
      />
    </form>
  );
}
