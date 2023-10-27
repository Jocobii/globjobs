import * as React from 'react';
import { DialogComponent } from '@gsuite/shared/ui';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useDeleteUsersFromTeam } from '../api/deleteFromTeam';
import { User } from '../../users/types/index';

interface Props {
  isModalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  isCustomer: boolean;
  dataList: User [];
  teamId: string;
}

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

export default function DeleteFromTeam({
  isModalOpen, setModalOpen, dataList, isCustomer,
  teamId,
}: Props) {
  const { mutateAsync } = useDeleteUsersFromTeam({});
  const { t } = useTranslation();
  const handleClose = () => {
    setModalOpen(false);
  };
  const coaches: User[] = [];
  const users: User[] = [];

  dataList.forEach((user) => {
    if (user?.role?.name.toLowerCase().includes('coach')) {
      coaches.push(user);
      return;
    }
    users.push(user);
  });

  const deleteUserFromTeam = async () => {
    const ids = dataList.map((value: { id: string }) => value?.id);
    await mutateAsync(
      {
        ids,
        teamId,
      },
    );
    handleClose();
  };

  return (
    <DialogComponent
      title={t('managements.teams.deleteToTeam')}
      aria-labelledby="customized-dialog-title"
      open={isModalOpen}
      okButtonVisibility
      cancelButtonVisibility
      okText={t('managements.teams.deleteToTeam')}
      cancelText={t('cancel')}
      handleClose={handleClose}
      handleConfirm={deleteUserFromTeam}
    >
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <Grid item xs={3}>
          <Typography variant="h6" gutterBottom>
            {t('managements.teams.doYouWishToDelete')}
          </Typography>
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            {coaches.length > 0 ? (
              <>
                <Grid item xs={6}>
                  {`${t('managements.coach')}:`}
                </Grid>
                <Grid item xs={6}>
                  {coaches.map((item) => (
                    <Typography gutterBottom key={`${item.name} ${item.lastName}`}>
                      {`${item.name} ${item.lastName}`}
                    </Typography>
                  ))}
                </Grid>
              </>
            ) : null}
            {
              users.length > 0 ? (
                <>
                  <Grid item xs={6}>
                    {isCustomer ? `${t('managements.teams.clients')}:` : `${t('managements.teams.specialists')}:`}
                  </Grid>
                  <Grid item xs={6}>
                    {users.map((item) => (
                      <Typography gutterBottom key={`${item.name} ${item.lastName}`}>
                        {isCustomer ? `${item.name}` : `${item.name} ${item.lastName}`}
                      </Typography>
                    ))}
                  </Grid>
                </>
              ) : null
            }
          </Grid>
        </Grid>
      </Grid>
    </DialogComponent>
  );
}
