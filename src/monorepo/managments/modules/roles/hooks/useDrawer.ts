import { useState } from 'react';
import { useDeleteRole } from '../api/deleteRole';

export default function useDrawer() {
  const [roleId, setRoleId] = useState<string>();
  const { mutateAsync: deleteRole } = useDeleteRole();

  const handleDrawerOpen = () => setRoleId('create');

  const handleEditDrawerClose = () => setRoleId(undefined);

  const handleMenuClick = (type: string, rowId: string) => {
    if (type === 'delete') {
      deleteRole({ roleId: rowId });
      return;
    }
    if (type === 'edit') {
      setRoleId(rowId);
    }
  };

  return {
    roleId,
    handleDrawerOpen,
    handleMenuClick,
    handleEditDrawerClose,
  };
}
