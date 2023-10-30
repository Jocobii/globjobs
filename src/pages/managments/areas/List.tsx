import { Container, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { useArea } from './hooks';
import Conditional from '@gsuite/ui/Conditional';
import loadable from '@loadable/component';
import { Table } from './components'

const DrawerForm = loadable(() => import('./components/DrawerForm'), { fallback: <p> </p> });

export default function List() {
  const { t } = useTranslation();
  const {
    query,
    handleDataGridEvents,
    handleDrawer,
    handleMenuClick,
    handleRefresh,
    openDrawer,
    areaId,
    handleEditDrawerClose,
  } = useArea();

  return (
    <Container maxWidth="xl">
      <Conditional
        loadable={openDrawer}
        initialComponent={null}
      >
        <DrawerForm
          open={openDrawer}
          onClose={handleEditDrawerClose}
          areaId={areaId}
        />
      </Conditional>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleDrawer}
        sx={{ height: 60, width: 200, marginBottom: '1%' }}
      >
        {t('managements.areas.addNewArea')}
      </Button>
      <Table
        handleDataGridEvents={handleDataGridEvents}
        handleMenuClick={handleMenuClick}
        handleRefresh={handleRefresh}
        data={query}
      />
    </Container>
  );
}
