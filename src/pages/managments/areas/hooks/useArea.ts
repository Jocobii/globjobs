import { useState } from 'react';
import { useGetAreas } from '../api/getAreas';
import { useDeleteArea } from '../api/deleteArea';
import { useDataGrid } from '@/hooks';

export const useArea = () => {
  const { variables, handleDataGridEvents } = useDataGrid();
  const query = useGetAreas({ variables });
  const [openDrawer, setOpenDrawer] = useState(false);
  const [areaId, setAreaId] = useState<string>('');
  const handleDrawer = () => setOpenDrawer(!openDrawer);
  const handleEditDrawerClose = () => {
    setAreaId('');
    handleDrawer()
  };
  const { mutateAsync } = useDeleteArea();

  const handleMenuClick = async (type: string, rowId: string) => {
    if (type === 'delete') {
      await mutateAsync({ areaId: rowId });

      return;
    }
    setAreaId(rowId);
    handleDrawer();
  };

  const handleRefresh = () => query.refetch();
  return {
    areaId,
    handleDrawer,
    handleEditDrawerClose,
    handleMenuClick,
    handleRefresh,
    openDrawer,
    query,
    handleDataGridEvents,
  }
};