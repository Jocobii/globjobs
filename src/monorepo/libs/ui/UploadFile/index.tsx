import {
  Stack,
  Input,
  ButtonBase,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ButtonLoading from '@mui/lab/LoadingButton';
import { useState, ChangeEvent, useEffect } from 'react';

type Props = {
  handleUpload: (image: Buffer) => void;
  setValue: (field: string, value?: string) => void;
  defaultImage?: string;
  accept?: string;
};
export default function UploadFile({
  handleUpload,
  defaultImage = undefined,
  setValue,
  accept = 'image/jpg',
}: Props) {
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null);
  const [selectedImage, setSelectedImage] = useState<ArrayBuffer>();
  const [imageUploaded, setImageUploaded] = useState(false);

  useEffect(() => {
    if (defaultImage) {
      setPreviewImage(defaultImage);
    }
  }, [defaultImage]);
  const handleRemoveImage = () => {
    setValue('photoUrl', undefined);
    setSelectedImage(undefined);
    setPreviewImage(null);
  };
  const uploadImage = () => {
    if (selectedImage) {
      handleUpload(selectedImage as Buffer);
      setImageUploaded(false);
    }
  };

  const readFileAsArrayBuffer = (
    file: File,
  ): Promise<ArrayBuffer> => new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as ArrayBuffer);
    };

    reader.onerror = () => {
      reject(new Error('Error reading file as array buffer.'));
    };

    reader.readAsArrayBuffer(file);
  });

  const readFileAsDataURL = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = () => {
      reject(new Error('Error reading file as data URL.'));
    };

    reader.readAsDataURL(file);
  });

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0];
    const buffer = await readFileAsArrayBuffer(file);
    setSelectedImage(buffer);

    const newPreviewImage = await readFileAsDataURL(file);
    setPreviewImage(newPreviewImage);
    setImageUploaded(true);
  };

  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyItems="center"
      sx={{ maxWidth: 300 }}
    >
      <ButtonBase
        component="label"
      >
        {!previewImage && (
          <CloudUploadIcon sx={{ fontSize: 50 }} />
        )}
        {previewImage && (
        <img
          src={previewImage as string}
          alt="preview"
        />
        )}
        <Input
          type="file"
          id="contained-button-file"
          onChange={handleImageUpload}
          sx={{ display: 'none' }}
          inputProps={{ accept }}
        />
      </ButtonBase>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
      >
        <ButtonLoading
          variant="contained"
          color="primary"
          onClick={handleRemoveImage}
          disabled={!imageUploaded && !previewImage}
          loading={false}
        >
          remove File
        </ButtonLoading>
        <ButtonLoading
          variant="contained"
          color="primary"
          onClick={uploadImage}
          disabled={!previewImage || !imageUploaded}
          loading={false}
        >
          Upload
        </ButtonLoading>
      </Stack>
    </Stack>
  );
}
