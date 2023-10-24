import { ChangeEvent, useState } from 'react';
import {
  Drawer,
  Grid,
  Typography,
  Button,
  Input,
  ButtonBase,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { FileDropZone } from '@gsuite/typings/files';
import useFiles from '@gsuite/shared/hooks/useFiles';

type Props = {
  visible: boolean;
  handleChangeVisibility: () => void
};

function Converter({ visible, handleChangeVisibility }: Props) {
  const {
    validateFile,
  } = useFiles();
  const [downloadAvailable, setDownloadAvailable] = useState(false);
  const [downloadData, setDownloadData] = useState(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setDownloadAvailable(false);
    setDownloadData(null);

    const file = event.target.files[0];

    validateFile(file as FileDropZone).then((response) => {
      setDownloadAvailable(true);
      setDownloadData(response.data);
    });
  };

  const handleDownload = () => {
    if (downloadData) {
      const link = document.createElement('a');
      const url = window.URL.createObjectURL(downloadData);
      link.href = url;
      link.setAttribute('download', 'converter-files.zip');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={visible}
      onClose={handleChangeVisibility}
      style={{ padding: 20 }}
      PaperProps={{ sx: { width: '30%' } }}
    >
      <Grid container spacing={2} style={{ padding: 20, textAlign: 'center' }}>
        <Grid item xs={12} style={{ textAlign: 'center' }}>
          <Typography variant="h5">Convertidor de archivo XLSX a XML</Typography>
        </Grid>
        <Grid item xs={12} style={{ alignContent: 'center' }}>
          <ButtonBase
            component="label"
          >
            <CloudUploadIcon sx={{ fontSize: 50 }} />
            <Input
              type="file"
              id="contained-button-file"
              onChange={handleFileChange}
              sx={{ display: 'none' }}
              inputProps={{
                accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
              }}
            />
          </ButtonBase>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            disabled={!downloadAvailable}
            onClick={handleDownload}
          >
            Descargar XML
          </Button>
        </Grid>
      </Grid>
    </Drawer>
  );
}

export default Converter;
