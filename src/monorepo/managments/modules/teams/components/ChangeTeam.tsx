import { useEffect, useState } from 'react';
import {
  Box, Button, Stack, Typography,
} from '@mui/material';
import { DeepPartial, SubmitHandler } from 'react-hook-form';

import { Formeazy } from '@gsuite/ui/Formeazy';
import { DialogComponent } from '@gsuite/shared/ui';
import { TFunctionType } from '@gsuite/typings/common';
import { ChangeTeam, changeTeamSchema } from '../types';
import { useRestfulTeams } from '../api/getFullTeams';
import { useChangeUsersFromTeam } from '../api/changeUsersFromTeam';
import { useChangeCompaniesFromTeam } from '../api/changeCompaniesFromTeam';
import DataList from './DataList';

type BaseProps = {
  t: TFunctionType;
  onClose: () => void;
};

type DrawerProps = {
  open: boolean;
  dataList: any[];
  isCustomer?: boolean;
} & BaseProps;

type ContentProps = {
  dataList: any[];
} & BaseProps;

type FormProps = {
  initialValues?: DeepPartial<ChangeTeam>;
  onSubmit: SubmitHandler<ChangeTeam>;
  listTitle: string;
  dataList: any[];
  isCustomer: boolean;
} & BaseProps;

type ConfirmTeamDialogType = {
  handleConfirm: () => void;
  handleClose: () => void;
  clients: any[];
};

function ConfirmTeamDialog({ handleConfirm, handleClose, clients }: ConfirmTeamDialogType) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4">Editar equipo</Typography>
      <Stack flexDirection="column" justifyContent="center" alignItems="center" sx={{ padding: 4 }}>
        {clients.filter((client) => client?.team !== null).map((client) => (
          <Stack>
            {`${client?.name ?? 'N/A'} pertenece al ${client?.team?.name ?? 'N/A'}`}
          </Stack>
        ))}
      </Stack>
      <Stack flexDirection="row" justifyContent="flex-end">
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleConfirm}>¿Continuar?</Button>
      </Stack>
    </Box>
  );
}

function ChangeTeamForm({
  onClose,
  initialValues = {},
  onSubmit,
  listTitle,
  dataList,
  isCustomer,
  t,
}: FormProps) {
  const { data } = useRestfulTeams();
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Formeazy<ChangeTeam>
        title={t<string>('managements.teams.teamChage')}
        schema={changeTeamSchema}
        submitLabel={t<string>('managements.teams.assignToTeam')}
        inputProps={{
          'team.id': {
            type: 'select',
            label: t<string>('managements.teams.teamSelect'),
            options: data?.teamsRestful?.map(({ id, name }) => ({
              value: id,
              title: name,
            })) || [],
          },
        }}
        extraContent={(
          <Box>
            <DataList
              title={listTitle}
              dataList={dataList}
              isCustomer={isCustomer}
            />
          </Box>
        )}
        initialValues={initialValues}
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </Box>
  );
}

function SpecialistContent({ dataList, onClose, t }: ContentProps) {
  const { mutateAsync } = useChangeUsersFromTeam({});
  const selectedUserIds = dataList.map((value: { id: string }) => value?.id);

  const onSubmit: SubmitHandler<ChangeTeam> = async ({ team }: ChangeTeam) => {
    await mutateAsync({
      teamId: team?.id,
      ids: selectedUserIds,
    });
    onClose();
  };
  return (
    <ChangeTeamForm
      t={t}
      listTitle={t<string>('managements.teams.doChengeTeam')}
      dataList={dataList}
      onClose={onClose}
      isCustomer={false}
      onSubmit={onSubmit}
    />
  );
}

function ClientContent({ dataList, onClose, t }: ContentProps) {
  const { mutateAsync } = useChangeCompaniesFromTeam({});
  const selectedClientIds = dataList.map((value: { number: string }) => value?.number);
  const selectedTeams = dataList.map(({ team }) => team?.name ?? null);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (selectedTeams.some((val) => val !== null)) {
      setConfirm(false);
    } else {
      setConfirm(true);
    }
  }, []);

  const onSubmit: SubmitHandler<ChangeTeam> = async ({ team }: ChangeTeam) => {
    await mutateAsync({
      teamId: team?.id,
      ids: selectedClientIds,
    });
    onClose();
  };

  const handleContinue = () => {
    setConfirm(true);
  };

  return (
    <>
      <span>{' '}</span>
      {
      confirm ? (
        <ChangeTeamForm
          t={t}
          listTitle={t<string>('managements.teams.selectedClients')}
          dataList={dataList}
          isCustomer
          onClose={onClose}
          onSubmit={onSubmit}
        />
      ) : (
        <ConfirmTeamDialog
          handleConfirm={handleContinue}
          handleClose={onClose}
          clients={dataList}
        />
      )
    }
    </>
  );
}

export default function DrawerChangeTeamForm({
  open, isCustomer = false, onClose, dataList, t,
}: DrawerProps) {
  return (
    <DialogComponent
      open={open}
      okButtonVisibility={false}
      cancelButtonVisibility={false}
      maxWidth="md"
    >
      {
        isCustomer
          ? <ClientContent onClose={onClose} dataList={dataList} t={t} />
          : <SpecialistContent onClose={onClose} dataList={dataList} t={t} />
      }
    </DialogComponent>
  );
}
