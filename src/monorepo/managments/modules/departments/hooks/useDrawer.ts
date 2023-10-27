import { useState } from 'react';
import { useDeleteDepartment } from '../api/deleteDepartment';

export function useDrawer() {
  const [departmentId, setDepartmentId] = useState<string>();
  const { mutateAsync } = useDeleteDepartment();

  const handleDrawerOpen = () => setDepartmentId('create');
  const handleDrawerClose = () => setDepartmentId(undefined);
  const handleMenuClick = (type: string, departmentId: string) => {
    if (type === 'delete') {
      mutateAsync({ departmentId });

      return;
    }

    setDepartmentId(departmentId);
  };
  
  return {
    departmentId,
    handleDrawerOpen,
    handleDrawerClose,
    handleMenuClick,
  };
}