import { useState } from 'react';
import axiosADP from '@/clients/axios-adp';
import { FieldValues } from 'react-hook-form';
import { useSnackNotification } from '@gsuite/shared/hooks';
import {
  getFormValues, MAX_FILES_LIMIT, getEmailFromToken, getFileTokenFromUrl, downloadFile,
} from '../utils';
import {
  Document, RemesaGroup, ResponseGrouped, FilterForm, GroupBy,
} from '../typings';

export const useAdp = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const [groupBy, setGroupBy] = useState<string>('Remesa');
  const [
    filesFetched,
    setFilesFetched,
  ] = useState<ResponseGrouped<RemesaGroup>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterForm>({
    client: '',
    startDate: new Date(),
    endDate: new Date(),
    pedimento: undefined,
    cove: undefined,
    factura: undefined,
    clave: undefined,
    aduana: undefined,
    patente: undefined,
    groupBy: 'Remesa',
  } as any);

  const [checked, setChecked] = useState<Document[]>([]);
  const { errorMessage, successMessage } = useSnackNotification();
  const [selectAll, setSelectAll] = useState<string[]>([]);
  const [pedimentos, setPedimentos] = useState<string[]>([]);

  const submitAdpToEmail = async () => {
    try {
      setIsLoading(true);
      if (checked.length > 0 && checked.length <= MAX_FILES_LIMIT) {
        await axiosADP.get('/send-zip', {
          params: {
            file_token: JSON.stringify(getFileTokenFromUrl(checked)),
            email: getEmailFromToken(),
          },
        });
      } else {
        const params = pedimentos.length > 0 ? {
          client: filter.client,
          pedimento: pedimentos.join(','),
        } : {
          ...filter,
        };

        await axiosADP.get('/zip', {
          params: {
            ...params,
            email: getEmailFromToken(),
            ...(groupBy === 'Remesa' && { groupBy: 'remesa' }),
          },
        });
      }
      setIsLoading(false);
      successMessage('Se han enviado los archivos a tu correo');
    } catch (error) {
      setIsLoading(false);
      errorMessage('No se han podido enviar los archivos a tu correo');
    }
  };

  const handleDownloadFiles = async () => {
    try {
      if (!checked.length) {
        errorMessage('No se han seleccionado archivos');
        return;
      }

      if (checked.length > MAX_FILES_LIMIT) {
        await submitAdpToEmail();
        successMessage('No se pueden descargar demasiados archivos pero han sido enviados a tu correo');
        return;
      }
      console.log('log tokens sended', getFileTokenFromUrl(checked));
      const response = await axiosADP.get('/zip/download', {
        params: {
          file_token: JSON.stringify(getFileTokenFromUrl(checked)),
          ...(groupBy === 'Remesa' && { groupBy: 'remesa' }),
        },
        responseType: 'blob',
      });
      downloadFile(response.data as unknown as Blob, 'application/zip', 'ADP');
    } catch (error) {
      errorMessage('No se han podido descargar los archivos');
    }
  };

  const handleSubmit = async (data: FieldValues) => {
    try {
      console.log('data', data);
      setIsLoading(true);
      handleOpen();

      const filters = {
        ...getFormValues(data),
        group_by: groupBy.toLowerCase(),
      } as unknown as FilterForm;
      console.log('filters', filters);
      const response = await axiosADP.get('/search', {
        params: filters,
      });
      if (
        response?.data?.body.data
        && (response?.data?.body.data?.length === 0
        || Object.keys(response?.data?.body?.data).length === 0)) {
        errorMessage('No se han encontrado archivos');
        setIsLoading(false);
        setFilesFetched(undefined);
        return;
      }

      setIsLoading(false);
      successMessage('Se han cargado los archivos');
      setFilesFetched(response.data);
      setFilter(filters);
    } catch (e) {
      console.log(e);
      errorMessage('No se han podido cargar los archivos');
      setIsLoading(false);
    }
  };

  const downloadPedimentosReport = async () => {
    if (!pedimentos.length) {
      errorMessage('No se han seleccionado pedimentos');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axiosADP.get('/audit/download', {
        params: {
          client: filter.client,
          pedimento: pedimentos.join(','),
        },
        responseType: 'blob',
      });
      downloadFile(response.data as unknown as Blob, 'application/vnd.ms-excel', 'Reporte de pedimentos');
      setIsLoading(false);
    } catch (error) {
      errorMessage('No se ha podido descargar el reporte');
      setIsLoading(false);
    }
  };

  const selectAllFiles = () => {
    if (selectAll.length > 0) {
      setSelectAll([]);
      setChecked([]);
      return;
    }
    let ids = [];
    if (groupBy === 'Remesa') {
      if (!Array.isArray(filesFetched?.body?.data)) return;
      const generalesTokens = filesFetched?.body?.data.map((item) => {
        const { files } = item;
        return files?.map((e) => ({ file_token: e?.file_token, father: item.pedimento }));
      })
        .flat();
      const remesaTokens = filesFetched?.body?.data.map((item) => {
        const { remesas } = item;
        return remesas?.map((remesa) => remesa.files
          .map((f) => ({
            file_token: f?.file_token,
            father: remesa.Pedimento,
            remesa: remesa.NumeroDeRemesa,
          })));
      })
        .flat();
      if (!generalesTokens) return;
      ids = generalesTokens.concat(remesaTokens?.flat() ?? []);
    } else {
      ids = filesFetched?.body?.data.map((item) => {
        const { files } = item;
        return files?.map((e) => ({ file_token: e.file_token, father: item.pedimento }));
      })
        .flat() ?? [];
    }
    setChecked(ids as Document[]);
    setSelectAll(ids.map((e) => e?.file_token ?? ''));
  };

  const handleOnChangeGroupBy = async (groupByOpt: GroupBy) => {
    if (filter.client) {
      setIsLoading(true);
      const response = await axiosADP.get('/search', {
        params: {
          ...filter,
          audit: true,
          group_by: groupByOpt === 'Remesa' ? 'remesa' : '',
        },
      });
      if (
        response?.data?.body.data
        && (response?.data?.body.data?.length === 0
        || Object.keys(response?.data?.body?.data).length === 0)) {
        errorMessage('No se han encontrado archivos con los filtros proporcionados');
        setFilesFetched(undefined);
        setIsLoading(false);
        return;
      }
      setFilesFetched(response.data);
      setIsLoading(false);
    }
    setGroupBy(groupByOpt);
  };

  return {
    handleDownloadFiles,
    handleOnChangeGroupBy,
    handleSubmit,
    handleOpen,
    selectAllFiles,
    submitAdpToEmail,
    isLoading,
    setPedimentos,
    filesFetched,
    groupBy,
    setGroupBy,
    selectAll,
    checked,
    setChecked,
    pedimentos,
    open,
    downloadPedimentosReport,
  };
};
