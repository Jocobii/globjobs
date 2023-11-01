import { useState } from "react";
import { useDeleteModule } from '../api/deleteModule';

export function useDrawer() {
  const [rowId, setRowId] = useState<string>();
  const { mutateAsync } = useDeleteModule();

  const handleDrawerOpen = () => setRowId('create');

  const handleEditDrawerClose = () => setRowId(undefined);

  const handleMenuClick = (type: string, id: string) => {
    if (type === 'delete') {
      mutateAsync({ moduleId: id });

      return;
    }

    setRowId(id);
  };

  return {
    rowId,
    handleDrawerOpen,
    handleEditDrawerClose,
    handleMenuClick,
  };
}