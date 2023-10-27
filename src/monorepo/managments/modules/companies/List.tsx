import {
  useState,
  useCallback,
  useEffect,
  Suspense,
  ChangeEvent,
} from 'react';
import {
  IconButton,
  Stack,
  Chip,
  Drawer,
  Typography,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  GridColumns,
  DataGridProProps,
  GridRowParams,
  GridFilterInputValueProps,
} from '@mui/x-data-grid-pro';
import CachedIcon from '@mui/icons-material/Cached';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import get from 'lodash/get';
import loadable from '@loadable/component';
import { useTranslation } from 'react-i18next';

import { CLIENT_ROLE } from '@gsuite/shared/utils/constants';
import { DataGrid } from '@gsuite/ui/DataGrid';
import LoadingBackdrop from '@gsuite/ui/LoadingBackdrop';
import Conditional from '@gsuite/ui/Conditional';

import { useGetUser } from '../users/api/getUser';
import { useGetCompanies } from './api/getCompanies';
import SelectCompany from './components/SelectCompany';
import DetailPanel from './components/DetailPanel';
import { Company, Rows } from './types';
import { AutoComplete } from '../users/CustomerUserForm';

const CustomerUser = loadable(() => import('../users/CustomerUserForm'), { fallback: <h3>Loading...</h3> });

type EditCustomer = {
  open: boolean;
  userId: string;
  roleId: string;
  companies: Pick<Rows, '_id' | 'number' | 'rfc' | 'name'>[];
};

function InputComponent({ applyValue, item }: GridFilterInputValueProps) {
  return (
    <TextField
      select
      variant="standard"
      InputLabelProps={{
        shrink: true,
      }}
      value={item.value}
      label="Value"
      onChange={(e: ChangeEvent<HTMLInputElement>) => applyValue({ ...item, value: e.target.value || '' })}
      fullWidth
    >
      <MenuItem key={1} value="active">
        Active
      </MenuItem>
      <MenuItem key={2} value="inactive">
        Inactive
      </MenuItem>
    </TextField>
  );
}

export default function List() {
  const [userId, setUserId] = useState('');
  const [openEditCustomer, setOpenEditCustomer] = useState<EditCustomer>({
    open: false,
    userId: '',
    roleId: '',
    companies: [],
  });
  const [variables, setVariables] = useState({});
  const query = useGetCompanies({ variables });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { refetch } = useGetUser({
    id: userId,
    config: {
      enabled: !!userId,
      suspense: true,
      onSuccess: (d) => {
        if (d && d?.role?.id === CLIENT_ROLE) {
          setOpenEditCustomer({
            open: true,
            userId,
            companies: d?.companies || [],
            roleId: d?.role?.id,
          });
        } else if (userId) {
          setUserId((prev) => prev);
        }
      },
      onError: () => setUserId(''),
    },
  });

  useEffect(() => {
    if (userId) refetch();
  }, [userId, refetch]);

  const handleRefresh = () => query.refetch();

  const handleDataGridEvents = (event = {}) => {
    if (Object.keys(event).length > 0) setVariables(event);
  };

  const handleUpdate = (id: string) => navigate(`update/${id}`);

  const handleEditUser = (id: string) => setUserId(id);

  const handleEditUserClose = () => {
    setUserId('');
    setOpenEditCustomer({
      open: false,
      userId: '',
      roleId: '',
      companies: [],
    });
  };

  const getDetailPanelContent = useCallback<
  NonNullable<DataGridProProps['getDetailPanelContent']>
  >(({ row }: GridRowParams) => {
    const {
      users, number, id, rfc, name,
    } = row;
    const client: AutoComplete = {
      _id: id,
      number,
      rfc,
      name,
    };

    return (
      <DetailPanel
        users={users}
        client={client}
        onUserEdit={handleEditUser}
      />
    );
  }, []);

  const columns: GridColumns = [
    {
      field: 'name',
      headerName: 'Empresa',
      width: 200,
    },
    {
      field: 'active',
      headerName: 'Estatus',
      width: 200,
      sortable: false,
      filterOperators: [
        {
          label: 'Equals',
          value: 'Equals',
          getApplyFilterFn: (filterValue: any) => (params: any) => params
            .value.toLowerCase().includes(String(filterValue).toLowerCase()),
          InputComponent,
        },
      ],
      renderCell: (params) => {
        const { value } = params;
        return (
          <Chip
            sx={{
              fontWeight: 'bold',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: value ? 'success' : 'error',
            }}
            variant="outlined"
            color={value ? 'success' : 'error'}
            label={value ? 'Active' : 'Inactive'}
          />
        );
      },
    },
    {
      field: 'rfc',
      headerName: 'RFC',
      width: 200,
    },
    {
      field: 'number',
      headerName: 'Clave',
      width: 200,
    },
    {
      field: 'users',
      headerName: 'Usuarios',
      width: 200,
      filterable: false,
      renderCell: (params) => {
        const { value } = params;
        return (value && value.length) || 0;
      },
    },
    {
      field: 'team.name',
      headerName: 'Equipo',
      width: 200,
      valueGetter: ({ row }) => get(row, 'team.name', 'N/A'),
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 200,
      filterable: false,
      sortable: false,
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            aria-label="editar"
            color="primary"
            onClick={() => handleUpdate(get(row, 'number'))}
          >
            <EditIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Suspense fallback={<LoadingBackdrop />}>
      <Conditional
        loadable={openEditCustomer.open}
        initialComponent={null}
      >
        <Suspense fallback={<LoadingBackdrop />}>
          <Drawer
            open={openEditCustomer.open}
            onClose={handleEditUserClose}
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
                {t('managements.usersModule.edit_user')}
              </Typography>
              <CustomerUser
                onClose={handleEditUserClose}
                userId={openEditCustomer.userId}
                mode="edit"
                companiesSelected={openEditCustomer.companies}
              />
            </Stack>
          </Drawer>
        </Suspense>
      </Conditional>
      <Stack spacing={2}>
        <SelectCompany
          handleSelectCompany={
          (selectedCompany: Company) => navigate(`detail/${Number(selectedCompany.Numero)}`)
        }
        />
        <DataGrid
          withDetail
          getDetailPanelContent={getDetailPanelContent}
          loading={query.isLoading || query.isFetching}
          getRowId={({ id }) => id}
          pinnedColumns={{ right: ['actions'] }}
          columns={columns}
          onClearConfig={() => setVariables({})}
          rows={query.data?.rows || []}
          actions={[
            <IconButton key="more-id" size="large" onClick={handleRefresh} disabled={query.isFetching}>
              <CachedIcon width={20} height={20} />
            </IconButton>,
          ]}
          mode="server"
          serverOptions={{
            totalRowCount: query.data?.total ?? 0,
            handleChange: handleDataGridEvents,
          }}
        />
      </Stack>
    </Suspense>
  );
}
