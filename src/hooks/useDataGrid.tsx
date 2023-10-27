import { useState, useCallback } from 'react';
import { filterOption } from '../utils/datagrid';
import { ModelOptions } from '@/components/datagrid/DataGrid';

export const usePagination = () => {
  const [variables, setVariables] = useState({});
  const [modelOptions, setModelOptions] = useState<ModelOptions>();
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const eventManager = useCallback((options: ModelOptions) => {
    setModelOptions((prev?: ModelOptions) => {
      const currentTableState = filterOption(prev, options);
      if (currentTableState?.page) {
        setPage(currentTableState?.page);
      }
      return filterOption(prev, options);
    });
  }, [setModelOptions]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 0) {
      return;
    }

    setPage(newPage + 1);
  };

  const handleDataGridEvents = (event: ModelOptions) => {
    console.log('event', event);
    if (Object.keys(event).length > 0) {
      setVariables(event);
    }
  };

  return {
    eventManager,
    handleDataGridEvents,
    handlePageChange,
    modelOptions,
    page,
    pageSize,
    setPage,
    setPageSize,
    setVariables,
    variables,
    setModelOptions,
  }
}