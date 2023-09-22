import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FileDropZone } from '@/typings/files';
import { CreateCrossingType, Crossing } from '../types'

export function useCreateOperation(id: string) {
  const navigate = useNavigate();
  const [crossing, setCrossing] = useState<Crossing>({} as Crossing)
  const [crossingValues, setCrossingValues] = useState<CreateCrossingType>({} as CreateCrossingType);
  const [files, setFiles] = useState<FileDropZone[]>([]);
  console.log('files', files);
  const onSubmit = useCallback(() => {
    if (!['new', '', false].includes(id)) {
      console.log('actualizar nodos solamente');
      setFiles([]);
      return;
    }
    console.log('files', files);
    if (files.length === 0) return;
    const {
      type, client, clientNumber,
      patente, aduana, comments
    } = crossingValues;

    const data = new FormData();
    data.append('type', type === 'Importacion' ? '1' : '2');
    data.append('customs', aduana);
    data.append('patent', patente);
    data.append('clientNumber', clientNumber);
    data.append('client', client);
    data.append('comments', comments ?? '');
    files.forEach((file) => data.append('files', file as Blob));

    const config = {
      method: 'post',
      url: 'http://localhost:3340/api/crossing/createCrossing',
      headers: { 
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZTY3OTExZDg0YjI0NGY0OTQ2NzZhMyIsIm5hbWUiOiJBbGV4YW5kZXIgSm9jb2JpIiwiZW1haWwiOiJhbGV4YW5kZXIuam9jb2JpQGctZ2xvYmFsLmNvbSIsImlhdCI6MTY5MzU5MjY2MH0.ToSrAjk42sjcjggDYhgJSRzpuWE4FOjvFD7fJtnnOPA', 
      },
      data
    };

    axios.request(config)
    .then((response) => {
      const { _id: id } = response.data;
      console.log(response.data);
      navigate(`../${id}`, { relative: 'path' })
      setCrossing(response.data)
      setFiles([]);
    })
    .catch((error) => {
      console.log(error);
    });
  }, [files, navigate]);

  useEffect(() => {
    if (files.length === 0) return; 
    onSubmit()
  }, [files, onSubmit])

  return {
    files,
    setFiles,
    onSubmit,
    setCrossingValues,
    crossing,
    setCrossing,
  }
}