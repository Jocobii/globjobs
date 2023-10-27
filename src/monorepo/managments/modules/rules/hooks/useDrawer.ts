import { useState } from 'react';
import { useDeleteRule } from '../api/deleteRule';

export function useDrawer() {
  const [ruleId, setRuleId] = useState<string>();
  const { mutateAsync } = useDeleteRule();

  const handleDrawerOpen = () => setRuleId('create');
  const handleDrawerClose = () => setRuleId(undefined);
  const handleMenuClick = (type: string, rowId: string) => {
    if (type === 'delete') {
      mutateAsync({ ruleId: rowId });

      return;
    }

    setRuleId(rowId);
  };
  
  return {
    ruleId,
    handleDrawerOpen,
    handleDrawerClose,
    handleMenuClick,
  };
}