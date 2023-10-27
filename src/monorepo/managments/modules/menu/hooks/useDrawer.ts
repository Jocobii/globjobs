import { useState } from "react";
import { useDeleteMenu } from '../api/deleteMenu';

export function useDrawer() {
  const [rowId, setRowId] = useState<string>();
  const { mutateAsync } = useDeleteMenu();

  const handleDrawerOpen = () => setRowId('create');

  const handleEditDrawerClose = () => setRowId(undefined);

  const handleMenuClick = (type: string, id: string) => {
    if (type === 'delete') {
      mutateAsync({ menuId: id });

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