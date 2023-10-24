/* eslint-disable react/jsx-props-no-spreading */
import {
  useState, useCallback, Dispatch, SetStateAction, useEffect, useRef, useContext,
} from 'react';
import { useDropzone, type Accept } from 'react-dropzone';
import {
  FormControl,
  FormLabel,
  Container,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  ListItemAvatar,
  Avatar,
  ListItemText,
  DialogContentText,
  List,
  ListItem,
  IconButton,
} from '@mui/material';
import { useTheme, alpha, styled } from '@mui/material/styles';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FolderOffTwoToneIcon from '@mui/icons-material/FolderOffTwoTone';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useTranslation } from 'react-i18next';

import { FileDropZone as FileType } from '@gsuite/typings/files';
import { DataContext, DataProvider } from '@gsuite/shared/contexts/AppContext';
import { normalizeString } from '@gsuite/shared/utils';

type Props = {
  label: string;
  filesSetter?: Dispatch<SetStateAction<FileType[]>>;
  files?: FileType[];
  fileRemove?: (id: string) => void;
  disabled?: boolean;
  accept?: Accept;
  maxFiles?: number;
};

const IconWrapperStyle = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(10),
  justifyContent: 'center',
  height: theme.spacing(10),
  marginBottom: theme.spacing(3),
  color: theme.palette.primary.main,
  backgroundColor: `${alpha(theme.palette.primary.main, 0.08)}`,
}));

const ACCEPT_DEFAULT: Accept = {
  pdf: ['application/pdf'],
  jpg: ['image/jpeg'],
  png: ['image/png'],
  doc: ['application/msword'],
  xls: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  csv: ['text/csv'],
  xml: ['application/xml', 'text/xml', 'application/rss+xml', 'application/atom+xml'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  txt: ['text/plain'],
};

function MaterialDropZone({
  label,
  filesSetter = () => null,
  files = [],
  fileRemove = () => null,
  disabled = false,
  accept = ACCEPT_DEFAULT,
  maxFiles = 999,
}: Props) {
  const { mode } = useContext(DataContext);
  const borderColorRef = useRef<string>();
  const borderRef = useRef<string>();
  const bordeColorOnHoverRef = useRef<string>();
  const theme = useTheme();
  const { t } = useTranslation();
  const [isHovering, setIsHovering] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const onDrop = useCallback(
    (receivedFiles: FileType[]) => {
      const newFiles = receivedFiles.map((file) => {
        const normalizedName = normalizeString(file.name);

        const newFile = new File(
          [file as any],
          normalizedName,
          { type: file.type as string },
        ) as FileType;
        newFile.id = normalizedName + Math.random();

        return newFile;
      });
      filesSetter((prev: FileType[]) => [...prev, ...newFiles]);
    },
    [filesSetter],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    accept,
    maxFiles,
  });
  borderColorRef.current = alpha(theme.palette.grey[500], 0.4);
  bordeColorOnHoverRef.current = mode === 'dark' ? 'white' : 'black';
  useEffect(() => {
    if (mode === 'dark') {
      borderColorRef.current = alpha(theme.palette.grey[100], 0.2);
    }
    if (isHovering && mode === 'dark') {
      bordeColorOnHoverRef.current = 'white';
    }
    if (isHovering && mode === 'light') {
      bordeColorOnHoverRef.current = 'black';
    }
  }, [mode, isHovering]);

  borderRef.current = isHovering ? bordeColorOnHoverRef.current : borderColorRef.current;
  if (isDragActive) borderRef.current = String(theme.palette.primary.main);

  const handleDeleteFile = (id: string | undefined) => {
    const updatedFiles = files.filter((file: FileType) => file.id !== id);
    filesSetter(updatedFiles);
    fileRemove(id as string);
  };

  const uploadedFiles = files.map(({ name, id }: FileType) => (
    <ListItem
      key={id}
      secondaryAction={(
        <IconButton edge="end" onClick={() => handleDeleteFile(id)}>
          <DeleteForeverIcon sx={{ color: theme.palette.error.main }} />
        </IconButton>
      )}
    >
      <ListItemAvatar>
        <Avatar>
          <InsertDriveFileIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText primary={name} />
    </ListItem>
  ));

  return (
    <>
      <Dialog
        sx={{
          width: 'auto',
        }}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <DialogTitle
          sx={{
            mb: 2,
          }}
        >
          {t<string>('ui.uploadedFiles')}
        </DialogTitle>
        <DialogContent
          sx={{
            width: {
              xs: theme.spacing(50),
              md: theme.spacing(90),
            },
            maxWidth: '100%',
          }}
        >
          {uploadedFiles.length > 0 ? (
            <List>{uploadedFiles}</List>
          ) : (
            <DialogContentText>{t<string>('ui.noFilesAdded')}</DialogContentText>
          )}
          <DialogContentText sx={{ textAlign: 'center', mt: 3 }}>
            {uploadedFiles.length > 0 && t('ui.removeFile')}
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <FormControl
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onBlur={() => setIsHovering(false)}
        component="fieldset"
        sx={{
          border: '1px solid',
          borderColor: borderRef.current,
          borderRadius: theme.spacing(1),
          width: '100%',
          marginTop: theme.spacing(1),
          height: theme.spacing(18),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <FormLabel
          sx={{
            ml: 2,
            fontSize: 13,
            paddingX: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: {
              xs: theme.spacing(18),
              sm: theme.spacing(30),
              md: theme.spacing(30),
            },
          }}
          component="legend"
        >
          {label}
        </FormLabel>
        <Chip
          onClick={() => setIsOpen(true)}
          variant="filled"
          sx={{
            position: 'absolute',
            top: -20,
            left: -10,
          }}
          label={files.length}
        />
        <Container
          {...getRootProps()}
          sx={{
            maxWidth: '2',
            display: 'flex',
            justifyItems: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            minHeight: theme.spacing(2),
            height: '20px',
            padding: theme.spacing(8),
            fontSize: theme.spacing(1),
          }}
        >
          {disabled ? (
            <Container>
              <IconWrapperStyle>
                <FolderOffTwoToneIcon sx={{ color: `${alpha(theme.palette.primary.main, 0.2)}` }} />
              </IconWrapperStyle>
            </Container>
          ) : (
            <Container>
              <IconWrapperStyle>
                <UploadFileIcon
                  sx={{
                    fontSize: theme.spacing(3),
                  }}
                />
              </IconWrapperStyle>
            </Container>
          )}
          <input {...getInputProps()} />
        </Container>
      </FormControl>
    </>
  );
}

// Obtenemos el contexto para utilizar el "theme"
export default function DropZone({
  label,
  filesSetter = () => null,
  files = [],
  fileRemove = () => null,
  disabled = false,
  accept = ACCEPT_DEFAULT,
  maxFiles = 999,
}: Props) {
  return (
    <DataProvider>
      <MaterialDropZone
        label={label}
        disabled={disabled}
        filesSetter={filesSetter}
        files={files}
        fileRemove={fileRemove}
        accept={accept}
        maxFiles={maxFiles}
      />
    </DataProvider>
  );
}
