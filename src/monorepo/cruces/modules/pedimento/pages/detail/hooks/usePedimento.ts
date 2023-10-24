import { useEffect, useState } from 'react';
import { get } from 'lodash';
import { getTagsFiles } from '@gsuite/shared/services/cruces';
import { FileDropZone } from '@gsuite/typings/files';
import axios from '@gsuite/shared/utils/axiosGlob';
import { useSnackNotification } from '@gsuite/shared/hooks';
import { useParams } from 'react-router-dom';

const UPLOAD_VALIDATION_FILE_STEP = 2;

export function usePedimento() {
  const { id } = useParams<{ id: string }>();
  const [disabled, setDisabled] = useState<boolean>(true);
  const { successMessage, errorMessage } = useSnackNotification();
  const [hasProforma, setHasProforma] = useState<boolean>(false);
  const [files, setFiles] = useState<FileDropZone[]>([]);
  const [step, setStep] = useState<number>(0);
  const [valuesForms, setValuesForms] = useState<any>({});

  useEffect(() => {
    if (files.length > 0) {
      setHasProforma(files.some((file) => get(file, 'tags', '').toLocaleLowerCase() === 'proforma'));
      if (step !== UPLOAD_VALIDATION_FILE_STEP) setDisabled(false);
    }
  }, [files]);

  const backStep = () => {
    if (step === 0) return;
    setStep(step - 1);
  };

  const getTagFiles = async () => {
    const response = await getTagsFiles(files);
    if (typeof response === 'string') {
      return response;
    }
    return response;
  };

  const clearAllSteps = () => {
    setStep(0);
    setFiles([]);
    setValuesForms({});
  };

  const handleSubmit = async (handleClose: any, refetch: any) => {
    if (step === 0) {
      const res = await getTagFiles();
      if (typeof res === 'string') {
        return;
      }
      const updatedFiles = files.map((file) => {
        const fileTag = res.find((tag) => tag.file === file.name);
        return Object.assign(file, { tags: fileTag?.tag });
      });
      setStep(step + 1);
      setFiles(updatedFiles);
      return;
    }
    if (step === 1 && !hasProforma) {
      const response = await axios.post('/uploadFilesToPedimento', {
        files,
        crossingId: id,
        filesTagged: files.map((file) => ({
          file: file.name,
          tags: get(file, 'tags', []),
        })),
        extraValues: valuesForms,
      }, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).catch((err) => {
        errorMessage('Error al agregar los archivos');
        console.log(err);
      });
      if (response) {
        successMessage('Archivos agregados correctamente');
      }
      clearAllSteps();
      handleClose();
      refetch();
    }

    if (step === 2) {
      const response = await axios.post('/uploadFilesToPedimento', {
        files,
        crossingId: id,
        filesTagged: files.map((file) => ({
          file: file.name,
          tags: get(file, 'tags', []),
        })),
        extraValues: valuesForms,
      }, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).catch((err) => {
        errorMessage('Error al agregar los archivos');
        console.log(err);
      });
      if (response) {
        successMessage('Archivos agregados correctamente');
      }
      clearAllSteps();
      handleClose();
      refetch();
      return;
    }
    setStep(step + 1);
  };

  return {
    getTagFiles,
    files,
    setFiles,
    step,
    setStep,
    backStep,
    setHasProforma,
    hasProforma,
    setValuesForms,
    valuesForms,
    setDisabled,
    disabled,
    handleSubmit,
    clearAllSteps,
  };
}
