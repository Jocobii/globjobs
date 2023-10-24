import { useState, SyntheticEvent } from 'react';
import loadable from '@loadable/component';
import { Stack, Container, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import { DataGridLoadingOverlay } from '@gsuite/ui/DataGrid';
import { useRestfulTeams } from './api/getFullTeams';

import DataGridActions from './components/DataGridActions';

const UsersList = loadable(() => import('./components/UsersList'), { fallback: <DataGridLoadingOverlay /> });
const CompaniesList = loadable(() => import('./components/CompaniesList'), { fallback: <DataGridLoadingOverlay /> });
const DrawerForm = loadable(() => import('./components/FormTeams'), { fallback: <p>Loading...</p> });
const DrawerChangeTeamForm = loadable(() => import('./components/ChangeTeam'), { fallback: <p>Loading...</p> });
const DrawerAddToTeamForm = loadable(() => import('./components/AddToTeam'), { fallback: <p>Loading...</p> });
const ModalAddCoachToTeam = loadable(() => import('./components/AddCoachToTeam'), { fallback: <p>Loading...</p> });
const ModalDeleteFromTeam = loadable(() => import('./components/DeleteFromTeam'), { fallback: <p>Loading...</p> });

export default function List() {
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCoachModalOpen, setCoachModalOpen] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [drawerAddIsOpen, setDrawerAddIsOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [changeDrawerIsOpen, setChangeDrawerIsOpen] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [selectionBatch, setSelectionBatch] = useState<any[]>([]);
  const { data } = useRestfulTeams();
  const { t } = useTranslation();

  const isCustomer = tabIndex === 0;

  const handleTabChange = (_e: SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setSelectionBatch([]);
  };

  const handleTeamChange = (value: string) => setSelectedTeam(value);

  const handleClose = () => {
    setIsOpen(false);
    setEditMode(false);
  };

  const handleCloseChangeDrawer = () => setChangeDrawerIsOpen(false);
  const handleBatchChange = (selection: any[]) => setSelectionBatch(selection);
  const handleCloseAddDrawer = () => setDrawerAddIsOpen(false);
  const handleOpenEditForm = () => {
    setIsOpen(true);
    setEditMode(true);
  };

  return (
    <Container maxWidth="xl">
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => setIsOpen(true)}
        sx={{ height: 60, width: 200, marginBottom: '2%' }}
      >
        {t<string>('managements.teams.newTeam')}
      </Button>
      <DrawerForm
        t={t}
        open={isOpen}
        onClose={handleClose}
        teamId={editMode ? selectedTeam : null}
      />
      <ModalAddCoachToTeam
        setModalOpen={setCoachModalOpen}
        isModalOpen={isCoachModalOpen}
        teamId={selectedTeam}
        teams={data}
      />
      <DrawerChangeTeamForm
        t={t}
        open={changeDrawerIsOpen}
        onClose={handleCloseChangeDrawer}
        isCustomer={isCustomer}
        key="change-team-drawer"
        dataList={selectionBatch}
      />
      <DrawerAddToTeamForm
        t={t}
        open={drawerAddIsOpen}
        onClose={handleCloseAddDrawer}
        isCustomer={isCustomer}
        teamId={selectedTeam || ''}
      />
      {
        selectionBatch.length > 0 && selectedTeam !== '' ? (
          <ModalDeleteFromTeam
            teamId={selectedTeam}
            isModalOpen={isModalOpen}
            setModalOpen={setModalOpen}
            isCustomer={isCustomer}
            dataList={selectionBatch}
          />
        ) : null
      }
      {
        tabIndex === 0 ? (
          <CompaniesList
            selectedTeam={selectedTeam}
            onRowSelect={handleBatchChange}
            t={t}
            actionsHeader={
              (
                <DataGridActions
                  t={t}
                  data={data}
                  isCustomer={isCustomer}
                  handleTabChange={handleTabChange}
                  tabIndex={tabIndex}
                  key="clients-actions"
                  selectedTeam={selectedTeam}
                  handleTeamChange={handleTeamChange}
                />
              )
            }
          />
        ) : (
          <UsersList
            t={t}
            selectedTeam={selectedTeam}
            onRowSelect={handleBatchChange}
            actionsHeader={
              (
                <DataGridActions
                  t={t}
                  data={data}
                  isCustomer={isCustomer}
                  handleTabChange={handleTabChange}
                  tabIndex={tabIndex}
                  key="users-actions"
                  selectedTeam={selectedTeam}
                  handleTeamChange={handleTeamChange}
                />
              )
            }
          />
        )
      }
      <Stack alignItems="flex-end" sx={{ py: 2, gap: 2 }}>
        {
          selectionBatch.length > 0 ? (
            <Stack direction="row" spacing={2}>
              {
                selectedTeam !== '' ? (
                  <Button
                    variant="outlined"
                    onClick={() => setModalOpen(true)}
                  >
                    {t<string>('managements.teams.deleteToTeam')}
                  </Button>
                ) : null
              }
              <Button
                variant="outlined"
                onClick={() => setChangeDrawerIsOpen(true)}
              >
                {t<string>('managements.teams.assignToTeam')}
              </Button>
              <Button
                variant="outlined"
                onClick={handleOpenEditForm}
              >
                {t<string>('managements.teams.editTeam')}
              </Button>
            </Stack>
          ) : null
        }
        {
          selectedTeam ? (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => setCoachModalOpen(true)}
              >
                {t<string>('managements.teams.addCoach')}
              </Button>
              <Button
                variant="contained"
                onClick={() => setDrawerAddIsOpen(true)}
              >
                {isCustomer ? t<string>('managements.teams.addClient') : t<string>('managements.teams.addSpecialist')}
              </Button>
            </Stack>
          ) : null
        }
      </Stack>
    </Container>
  );
}
