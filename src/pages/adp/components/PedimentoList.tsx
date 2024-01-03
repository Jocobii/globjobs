import { ChangeEvent, useState } from 'react';
import {
  List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Checkbox, Typography,
  Grid, Collapse, Chip,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import {
  Pediment, File, Remesa,
  Document, ResponseGrouped,
  PedimentoGroup, RemesaGroup,
} from '../typings';
import { DrawerViewer } from './DrawerViewer';
import { FilesMissingTooltip } from './FilesMissingTooltip';

interface Props {
  data: ResponseGrouped<RemesaGroup | PedimentoGroup>;
  setChecked: (value: Document[]) => void;
  checked: Document[];
  isSelectAll: boolean;
  setPedimentos: (value: string[]) => void;
  pedimentos: string[];
}

type SimplePedimento = {
  pedimento: string;
  aduana: string;
  patente: string;
  tipo: string;
  generales: File[],
  remesas: Remesa[]
  files?: File[];
  audit?: string[];
  score: {
    required: number;
    total: number;
  },
  total_files: number;
};

const getOnlyMissingFiles = (audit: Record<string, boolean>) => Object
  .entries(audit)
  .filter(([, value]) => !value)
  .map(([key]) => key);

const mapperToSimplePedimento = (data: Pediment[]) => data?.map((pedimento) => {
  const newPedimento: SimplePedimento = {
    pedimento: pedimento.pedimento,
    aduana: pedimento.aduana,
    patente: pedimento.patente,
    tipo: pedimento.tipo.toString(),
    generales: [] as File[],
    remesas: [],
    audit: pedimento.audit ? getOnlyMissingFiles(pedimento.audit) : [],
    score: {
      required: 0,
      total: 0,
    },
    total_files: pedimento.total_files,
  };
  if (
    pedimento?.generales
    || pedimento?.files) {
    newPedimento.generales = pedimento?.generales?.length ?? 0 >= 1
      ? pedimento.generales ?? []
      : pedimento.files ?? [];
  }
  if (Array.isArray(pedimento?.remesas) && pedimento?.remesas?.length > 0) {
    newPedimento.remesas = pedimento?.remesas?.map((remesa) => ({
      ...remesa,
      files: remesa?.files?.map((e) => ({ ...e, remesaFather: remesa.NumeroDeRemesa })),
    }));
  }
  return newPedimento;
});

export const combineRemesasAndGeneral = (data: ResponseGrouped<PedimentoGroup | RemesaGroup>) => {
  if (Array.isArray(data.body.data)) {
    return mapperToSimplePedimento(data.body.data);
  }
  const pedimentosObj = Object.entries(data.body.data);
  const pedimentos = pedimentosObj.map(([, value]) => value[0]);
  return mapperToSimplePedimento(pedimentos);
};

const isPedimento = (value = '') => /^\d{7}$/.test(value);
const getColorByIndex = (index: number) => (index % 2 === 0 ? 'grey.250' : '');

interface GenerateListProps {
  data: ResponseGrouped<PedimentoGroup | RemesaGroup>;
  checked: Document[];
  setChecked: (value: Document[]) => void;
  setCurrentFile: (value: Partial<File>) => void;
  handleOpenDrawerViewer: () => void;
  isSelectAll: boolean;
  setPedimentos: (pedimentos: string[]) => void;
  pedimentos: string[];
}

const GenerateList = ({
  data,
  checked,
  setChecked,
  setCurrentFile,
  handleOpenDrawerViewer,
  isSelectAll = false,
  setPedimentos,
  pedimentos,
}: GenerateListProps) => {
  const mappedData = combineRemesasAndGeneral(data);
  const [open, setOpen] = useState(false);
  const [openSubFolder, setSubFolder] = useState(false);
  const [currentPedimento, setCurrentPedimento] = useState(0);
  const [remesaSelected, setRemesa] = useState(0);
  const handleOpen = () => setOpen(!open);
  const handleOpenOnClick = (pedimento: number) => {
    setCurrentPedimento(pedimento);
    handleOpen();
  };
  const handleOpenOnClickRemesa = (remesa: number) => {
    setRemesa(remesa);
    setSubFolder(!openSubFolder);
  };
  const handleOpenDrawer = (file: Partial<File>) => {
    setCurrentFile(file);
    handleOpenDrawerViewer();
  };
  // eslint-disable-next-line sonarjs/cognitive-complexity
  const handleToggle = (value: string, selectAll = false, fatherFolder = '') => ({ target }: ChangeEvent<HTMLInputElement>) => {
    const valueIsPedimento = isPedimento(value);
    const { checked: isChecked } = target;

    if (!selectAll) {
      if (isChecked) {
        setChecked([...checked, { file_token: value, father: fatherFolder }]);
        return;
      }
      setChecked(checked.filter((e) => e.file_token !== value));
      return;
    }
    const pedimentoFound = mappedData
      .find((item) => item.pedimento === (valueIsPedimento ? value : fatherFolder));
    if (!valueIsPedimento && pedimentoFound) {
      const remesaFound = pedimentoFound.remesas
        .find((remesa) => remesa.NumeroDeRemesa.toString() === value);
      if (isChecked && remesaFound) {
        const files = remesaFound.files.map((file) => ({
          file_token: file.file_token,
          father: fatherFolder,
          remesa: value,
        }) as Document);
        setChecked([...checked, ...files]);
        return;
      }
      setChecked(checked.filter((e) => e.father !== fatherFolder && e.remesa !== value));
      return;
    }
    if (isChecked && pedimentoFound) {
      setPedimentos([...new Set([...pedimentos, value])]);

      const files = pedimentoFound?.generales.map((file) => ({
        file_token: file.file_token,
        father: value,
      }));
      const remesaFiles = pedimentoFound?.remesas.map((remesa) => remesa.files.map((file) => ({
        file_token: file.file_token,
        father: value,
        remesa: remesa.NumeroDeRemesa.toString(),
      }))).flat();
      setChecked([...checked, ...files, ...remesaFiles]);
      return;
    }
    setPedimentos(pedimentos.filter((e) => e !== value));
    setChecked(checked.filter((e) => e.father !== value));
  };

  return mappedData.map((value) => (
    <>
      <ListItem
        key={value.pedimento}
      >
        <Checkbox
          edge="start"
          key={value.pedimento}
          onChange={handleToggle(value.pedimento, true)}
          tabIndex={-1}
          checked={
            Boolean(
              checked.find((e) => e.father === value.pedimento) || isSelectAll,
            )
          }
          disableRipple
        />
        <ListItemButton
          dense
          key={value.pedimento}
          onClick={() => handleOpenOnClick(Number(value.pedimento))}
        >
          <ListItemIcon sx={{ alignItems: 'center' }}>
            {open && currentPedimento === Number(value.pedimento)
              ? <FolderOpenIcon />
              : <FolderIcon />}
          </ListItemIcon>
          <ListItemText primary={(
            <>
              {`${value.patente}-${value.aduana}-${value.pedimento}`}
              <Chip sx={{ ml: 2 }} label={value.tipo === '1' ? 'Importacion' : 'Exportacion'} />
            </>
          )}
          />
        </ListItemButton>
        <FilesMissingTooltip filesNames={value.audit ?? []} />
        <Typography variant="body1" sx={{ ml: 2 }}>
          (
          {value.total_files}
          {' '}
          Archivos
          )
        </Typography>
      </ListItem>
      <Collapse
        in={open && currentPedimento === Number(value.pedimento)}
        timeout="auto"
        unmountOnExit
        sx={{ width: '100%' }}
      >
        <List
          component="div"
          disablePadding
          sx={{ width: '100%' }}
        >
          {
            value.generales?.map((file, index) => (
              <Grid xs={12}>
                <ListItem
                  key={file.file_token}
                  sx={{ width: '100%', backgroundColor: getColorByIndex(index) }}
                >
                  <Checkbox
                    edge="start"
                    sx={{ marginLeft: '1rem' }}
                    key={`${file.file_token}-${file.file_token}`}
                    onChange={handleToggle(file.file_token, false, value.pedimento)}
                    checked={
                      Boolean(
                        checked.find((e) => e.file_token === file.file_token) || isSelectAll,
                      )
                    }
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemIcon
                    onClick={() => handleOpenDrawer({
                      file_token: file.file_url,
                      fileName: file.fileName,
                    })}
                    style={{ cursor: 'pointer' }}
                  >
                    <Chip label={file.fileType} />
                  </ListItemIcon>
                  <ListItemText
                    primary={file.fileName}
                    onClick={() => handleOpenDrawer({
                      file_token: file.file_url,
                      fileName: file.fileName,
                    })}
                    style={{ cursor: 'pointer' }}
                  />
                </ListItem>
              </Grid>
            ))
          }
          {value.remesas?.map((remesa, index) => (
            <>
              <Grid container xs={12} sx={{ width: '100%' }}>
                <ListItem
                  key={remesa.Pedimento}
                  sx={{ backgroundColor: getColorByIndex(index) }}
                >
                  <Checkbox
                    edge="start"
                    sx={{ marginLeft: '4rem' }}
                    key={value.pedimento}
                    onChange={handleToggle(
                      remesa.NumeroDeRemesa.toString(),
                      true,
                      value.pedimento.toString(),
                    )}
                    checked={
                      Boolean(
                        checked.find((e) => e.remesa === remesa.NumeroDeRemesa.toString())
                        || isSelectAll,
                      )
                    }
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemButton
                    dense
                    key={value.pedimento}
                    onClick={() => handleOpenOnClickRemesa(Number(remesa.NumeroDeRemesa))}
                  >
                    <ListItemIcon sx={{ alignItems: 'center' }}>
                      {open
                        && currentPedimento === Number(value.pedimento)
                        && remesaSelected === Number(remesa.NumeroDeRemesa)
                        ? <FolderOpenIcon />
                        : <FolderIcon />}
                    </ListItemIcon>
                    <ListItemText primary={remesa.NumeroDeRemesa} />
                  </ListItemButton>
                </ListItem>
              </Grid>
              <Collapse
                in={open
                  && openSubFolder
                  && currentPedimento === Number(value.pedimento)
                  && remesaSelected === Number(remesa.NumeroDeRemesa)}
                timeout="auto"
                unmountOnExit
                sx={{ width: '100%' }}
              >
                <List component="div" sx={{ width: '100%' }}>
                  {Array.isArray(remesa.files) && remesa.files.map((remesaFiles, inx) => (
                    <Grid container key={remesaFiles.fileName}>
                      <ListItem
                        key={remesaFiles.file_token}
                        sx={{ width: '100%', backgroundColor: getColorByIndex(inx) }}
                      >
                        <Checkbox
                          edge="start"
                          key={`${remesaFiles.file_token}-${remesaFiles.file_token}`}
                          sx={{ marginLeft: '6rem' }}
                          onChange={handleToggle(
                            remesaFiles.file_token,
                            false,
                            remesa.NumeroDeRemesa.toString(),
                          )}
                          checked={
                            Boolean(
                              checked.find((e) => e.file_token === remesaFiles.file_token),
                            )
                          }
                          tabIndex={-1}
                          disableRipple
                        />
                        <ListItemIcon
                          onClick={() => handleOpenDrawer({
                            file_token: remesaFiles.file_url,
                            fileName: remesaFiles.fileName,
                          })}
                          style={{ cursor: 'pointer' }}
                        >
                          <Chip label={remesaFiles.fileType} />
                        </ListItemIcon>
                        <ListItemText
                          primary={remesaFiles.fileName}
                          onClick={() => handleOpenDrawer({
                            file_token: remesaFiles.file_url,
                            fileName: remesaFiles.fileName,
                          })}
                          style={{ cursor: 'pointer' }}
                        />
                      </ListItem>
                    </Grid>
                  ))}
                </List>
              </Collapse>
            </>
          ))}
        </List>
      </Collapse>
    </>
  ));
};

export function PedimentoList({
  data, checked, setChecked, isSelectAll, setPedimentos, pedimentos,
}: Props) {
  const [currentFile, setCurrentFile] = useState<Partial<File>>({ file_token: '', fileName: '' });
  const [openDrawer, setOpenDrawer] = useState(false);
  const handleOpenDrawerViewer = () => setOpenDrawer(!openDrawer);

  if (!data) return null;
  return (
    <>
      <List>
        {GenerateList({
          data,
          checked,
          setChecked,
          setCurrentFile,
          handleOpenDrawerViewer,
          isSelectAll,
          setPedimentos,
          pedimentos,
        })}
      </List>
      <DrawerViewer
        file={currentFile}
        openDrawer={openDrawer}
        setOpenDrawer={handleOpenDrawerViewer}
      />
    </>
  );
}
