import {
  IconButton,
  Stack,
  Button,
  Box,
  useTheme,
  Drawer,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import loadable from '@loadable/component';
import EditIcon from '@mui/icons-material/Edit';
import { GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid-pro';
import first from 'lodash/first';

import { DataGrid } from '@gsuite/shared/ui';
import Conditional from '@gsuite/ui/Conditional';

import { useState, Suspense } from 'react';
import { User } from '../types';
import { AutoComplete } from '../../users/CustomerUserForm';

const CustomerUser = loadable(() => import('../../users/CustomerUserForm'), { fallback: <h3>Loading...</h3> });

type EditCustomer = {
  open: boolean;
  userId: string;
  roleId: string;
  companies: AutoComplete[];
};

export default function DetailPanel({
  users,
  client,
  onUserEdit,
}: {
  users: User[],
  client: AutoComplete,
  onUserEdit: (id: string) => void,
}) {
  const { t } = useTranslation();
  const [openEditCustomer, setOpenEditCustomer] = useState<EditCustomer>({
    open: false,
    userId: '',
    roleId: '',
    companies: [client],
  });

  const handleEditCustomerClose = () => setOpenEditCustomer({
    open: false,
    userId: '',
    roleId: '',
    companies: [client],
  });
  const handleOpenCreateCustomer = () => setOpenEditCustomer({
    open: true,
    userId: '',
    roleId: '',
    companies: [client],
  });

  const rows: GridValueGetterParams[] = JSON.parse(JSON.stringify(users));
  const theme = useTheme();

  return (
    <Box sx={{ pt: 1, background: theme.palette.background.paper }}>
      <DataGrid
        columns={[
          {
            field: 'user',
            headerName: 'Usuario',
            width: 200,
            renderCell: (
              params: GridRenderCellParams,
            ) => {
              const { row: { emailAddress } } = params;
              const user = emailAddress.split('@');
              return first(user) || '';
            },
          },
          {
            field: 'fullName',
            headerName: 'Nombre Completo',
            width: 200,
            renderCell: (
              params: GridRenderCellParams,
            ) => {
              const { row: { name, lastName } } = params;

              return `${name} ${lastName}`;
            },
          },
          {
            field: 'emailAddress',
            headerName: 'Correo',
            width: 200,
          },
          {
            field: 'phoneNumber',
            headerName: 'Teléfono',
            width: 200,
          },
          {
            field: 'actions',
            headerName: 'Acciones',
            width: 200,
            filterable: false,
            sortable: false,
            renderCell: ({ row }: GridRenderCellParams) => (
              <Stack direction="row" spacing={1}>
                <IconButton
                  aria-label="editar"
                  color="primary"
                  onClick={() => onUserEdit(row.id)}
                >
                  <EditIcon />
                </IconButton>
              </Stack>
            ),
          },
        ]}
        rows={rows}
        getRowId={({ emailAddress }: User) => emailAddress}
        renderToolbar={false}
      />
      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={2}
        style={{
          paddingBottom: 20,
          background: theme.palette.background.paper,
        }}
      >
        <Button variant="outlined" onClick={handleOpenCreateCustomer}>Agregar Usuario</Button>
      </Stack>
      <Conditional
        loadable={openEditCustomer.open}
        initialComponent={null}
      >
        <Suspense fallback={<h3>Loading...</h3>}>
          <Drawer
            open={openEditCustomer.open}
            onClose={handleEditCustomerClose}
            PaperProps={{ sx: { pb: 5, width: 600 } }}
            anchor="right"
            ModalProps={{
              keepMounted: false,
            }}
          >
            <Stack
              direction="column"
              justifyContent="space-between"
              spacing={2}
              sx={{ p: 2 }}
            >
              <Typography variant="h4" gutterBottom>
                {t<string>('managements.usersModule.edit_user')}
              </Typography>
              <CustomerUser
                onClose={handleEditCustomerClose}
                userId={openEditCustomer.userId}
                mode="create"
                companiesSelected={openEditCustomer.companies}
              />
            </Stack>
          </Drawer>
        </Suspense>
      </Conditional>
    </Box>
  );
}
