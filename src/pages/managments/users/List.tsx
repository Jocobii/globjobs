import {
  useState,
  Suspense,
  ChangeEvent,
  useCallback,
} from 'react';
import get from 'lodash/get';
import loadable from '@loadable/component';
import {
  Container,
  Button,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  TextField,
  MenuItem,
  useTheme,
  Box,
  Drawer,
  Typography,
} from '@mui/material';
import {
  GridValueGetterParams,
  GridRenderCellParams,
  DataGridProProps,
  GridRowParams,
  GridFilterInputValueProps,
} from '@mui/x-data-grid-pro';
import AddIcon from '@mui/icons-material/Add';
import CachedIcon from '@mui/icons-material/Cached';
import { NoAccounts, AccountCircle } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import {
  DataGrid as DataGridMinimal,
} from '@gsuite/shared/ui';
import { DataGrid } from '../../../components/datagrid';
import { Conditional } from '../../../components';
import { CLIENT_ROLE } from '../../../routes/paths';

import EnableOrDisabledModal from './components/EnableOrDisabledModal';
import { User, Company } from './types';
import CustomFilters, { Filter } from './components/CustomFilters';
import { AutoComplete } from './CustomerUserForm';
import { useGetUsers } from './api/getUsers';

const CreateForm = loadable(() => import('./Create'), { fallback: <h3>Loading...</h3> });
const UpdateForm = loadable(() => import('./Update'), { fallback: <h3>Loading...</h3> });
const CustomerUser = loadable(() => import('./CustomerUserForm'), { fallback: <h3>Loading...</h3> });

type EditCustomer = {
  open: boolean;
  userId: string;
  roleId: string;
  companies: AutoComplete[];
};

function DetailPanelContent({ companies }: { companies: Company[] }) {
  const rows: GridValueGetterParams[] = JSON.parse(JSON.stringify(companies));
  const theme = useTheme();
  const isLightMode: boolean = theme.palette.mode === 'light';

  return (
    <Box sx={{ pt: 1, background: isLightMode ? '#fff' : 'none' }}>
      <DataGridMinimal
        columns={[
          {
            field: 'name',
            headerName: 'Empresa',
            width: 200,
          },
          {
            field: 'rfc',
            headerName: 'RFC',
            width: 200,
          },
          {
            field: 'number',
            headerName: '#Clave SAP',
            width: 200,
          },
        ]}
        rows={rows}
        getRowId={({ number }: Company) => number}
        renderToolbar={false}
      />
    </Box>
  );
}

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
  const [variables, setVariables] = useState<any>({});
  const [showCompanies, setShowCompanies] = useState<boolean>(false);
  const query = useGetUsers({ variables });
  const { t } = useTranslation();
  const [userSelected, setUserSelected] = useState<Partial<User>>({});
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openEditCustomer, setOpenEditCustomer] = useState<EditCustomer>({
    open: false,
    userId: '',
    roleId: '',
    companies: [],
  });
  const [userId, setUserId] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const handleDrawerClose = () => setOpenDrawer(false);
  const handleDrawerOpen = () => setOpenDrawer(true);
  const handleEditDrawerClose = () => setUserId('');
  const [hoveredRowId, setHoveredRowId] = useState<null | string>(null);
  const [hasActiveStatusFilter, setHasActiveStatusFilter] = useState(false);
  const handleEditCustomerClose = () => setOpenEditCustomer({
    open: false,
    userId: '',
    roleId: '',
    companies: [],
  });

  const onMouseEnterRow = (event: React.MouseEvent<HTMLInputElement>) => {
    const id = event.currentTarget.getAttribute('data-id');
    setHoveredRowId(id);
  };

  const onMouseLeaveRow = () => {
    setHoveredRowId(null);
  };

  const verifyArrayFilters = (
    prev: any,
    prevFilters: { c: string, v: string }[],
    params: Filter,
  ) => {
    const newFilters = [...prevFilters];
    const activeFilterIndex = newFilters.findIndex((x: { c: string }) => x.c === 'active');
    if (
      activeFilterIndex >= 0
      && params
    ) {
      newFilters[activeFilterIndex].v = params.filter[0]?.v;
    }
    if (activeFilterIndex < 0 && params) newFilters.push(params?.filter[0]);
    if (!params && activeFilterIndex >= 0) newFilters.splice(activeFilterIndex, 1);
    return {
      ...prev,
      filter: newFilters,
    };
  };

  const handleChangeActiveStatusFilter = (params: Filter) => setVariables((prev: any) => {
    const newFilter = params?.filter[0];
    const prevFilters = prev?.filter || [];
    setHasActiveStatusFilter(newFilter?.v === '1' || newFilter?.v === '0');

    if (!prevFilters || prevFilters.length < 1) {
      return {
        ...prev,
        filter: newFilter,
      };
    }

    if (prevFilters && Array.isArray(prevFilters)) {
      return verifyArrayFilters(prev, prevFilters, params);
    }

    if (typeof prevFilters === 'object' && !Array.isArray(prevFilters)) {
      return {
        ...prev,
        filter: params?.filter,
      };
    }
    return prev;
  });

  const handleMenuClick = (
    type: string,
    rowId: string,
    roleId?: string,
    companies?: AutoComplete[],
  ) => {
    if (type === 'delete') {
      return;
    }

    if (type === 'edit' && roleId === CLIENT_ROLE) {
      setOpenEditCustomer({
        open: true,
        userId: rowId,
        roleId,
        companies: companies ?? [],
      });
      return;
    }
    setUserId(rowId);
  };

  const handleRefresh = () => query.refetch();

  const handleDataGridEvents = (event: any) => {
    if (Object.keys(event).length > 0) {
      setVariables((prev: any) => {
        const filterValue = event?.filter;
        const newActiveFilter = event?.filter?.find((x: { c: string }) => x.c === 'active');
        const prevState = { ...prev };
        if (!prevState?.filter) {
          return {
            ...event,
          };
        }
        const previousFilter = prevState?.filter;
        if (typeof previousFilter === 'object' && filterValue) {
          if (Array.isArray(previousFilter)) {
            const activeParam = previousFilter.find((x) => x.c === 'active');

            return {
              ...event,
              ...(!!activeParam && !newActiveFilter && {
                filter: filterValue.concat([activeParam]),
              }),
            };
          }

          const hasActiveKey = previousFilter?.c === 'active';
          return {
            ...event,
            ...(hasActiveKey && {
              filter: [...filterValue].concat([previousFilter]),
            }),
          };
        }
        return { ...prev, ...event };
      });
    }
  };

  const getDetailPanelContent = useCallback<NonNullable<DataGridProProps['getDetailPanelContent']>>(({ row }: GridRowParams) => (
    <DetailPanelContent companies={row.companies} />
  ), []);

  const columns = showCompanies ? [
    {
      field: 'name',
      headerName: 'Nombre Completo',
      width: 300,
      renderCell(params: GridRenderCellParams) {
        const { row } = params;
        return `${row.name} ${row.lastName}`;
      },
    },
    {
      field: 'emailAddress',
      headerName: 'Correo',
      width: 300,
    },
    {
      field: 'companies',
      headerName: 'Empresas',
      width: 100,
      renderCell(params: GridRenderCellParams) {
        const { value } = params;
        return value.length;
      },
    },
    {
      field: 'phoneNumber',
      headerName: 'Teléfono',
      width: 200,
    },
    {
      headerName: t('managements.active'),
      width: 200,
      field: 'active',
      sortable: false,
      filterable: !hasActiveStatusFilter,
      filterOperators: [
        {
          label: 'Equals',
          value: 'Equals',
          getApplyFilterFn: (filterValue: any) => (params: any) => params
            .value.toLowerCase().includes(String(filterValue).toLowerCase()),
          InputComponent,
        },
      ],
      renderCell: ({ value }: GridRenderCellParams) => (
        <Chip
          sx={{
            fontWeight: 'bold',
          }}
          variant="outlined"
          color={value ? 'success' : 'error'}
          label={value ? 'Active' : 'Inactive'}
        />
      ),
    },
    {
      field: 'lastLogin',
      headerName: 'Último Acceso',
      width: 200,
      type: 'date',
      renderCell(params: GridRenderCellParams) {
        const { value } = params;
        if (!value) return null;
        return `${dayjs(value).format('DD/MMMM/YYYY - HH:mm')} hrs`;
      },
    },
    {
      field: 'actions',
      headerName: '',
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (record: GridRenderCellParams) => {
        if (hoveredRowId === record.id) {
          return (
            <Stack direction="row">
              <Tooltip title={record.row.active ? t('managements.disabled') : t('managements.enable')} placement="top">
                <IconButton
                  onClick={() => {
                    setUserSelected({
                      id: record?.id?.toString() || '',
                      name: record.row.name,
                      lastName: record.row.lastName,
                      active: record.row.active,
                    });
                    setOpenModal(true);
                  }}
                >
                  {record.row.active ? <NoAccounts /> : <AccountCircle />}
                </IconButton>
              </Tooltip>
              <IconButton onClick={() => handleMenuClick('edit', String(record.id), record.row?.role?.id, record.row.companies)}>
                <EditIcon />
              </IconButton>
            </Stack>
          );
        }
        return null;
      },
    },
  ] : [
    {
      field: 'name',
      headerName: t('managements.name'),
      width: 200,
    },
    {
      field: 'lastName',
      headerName: t('managements.lastName'),
      width: 200,
    },
    {
      headerName: t('managements.active'),
      width: 200,
      field: 'active',
      sortable: false,
      filterable: !hasActiveStatusFilter,
      filterOperators: [
        {
          label: 'Equals',
          value: 'Equals',
          getApplyFilterFn: (filterValue: any) => (params: any) => params
            .value.toLowerCase().includes(String(filterValue).toLowerCase()),
          InputComponent,
        },
      ],
      renderCell: ({ value }: GridRenderCellParams) => (
        <Chip
          sx={{
            fontWeight: 'bold',
          }}
          variant="outlined"
          color={value ? 'success' : 'error'}
          label={value ? 'Active' : 'Inactive'}
        />
      ),
    },
    {
      field: 'emailAddress',
      headerName: t('managements.emailAddress'),
      width: 200,
    },
    {
      field: 'employeeNumber',
      headerName: t('managements.employeeNumber'),
      width: 200,
    },
    {
      field: 'phoneNumber',
      headerName: t('managements.phoneNumber'),
      width: 200,
    },
    {
      field: 'headquarter.name',
      headerName: t('managements.site'),
      width: 200,
      valueGetter: ({ row }: GridRenderCellParams) => get(row, 'headquarter.name', 'N/A'),
    },
    {
      field: 'department.name',
      headerName: t('managements.department'),
      width: 200,
      valueGetter: ({ row }: GridRenderCellParams) => get(row, 'department.name', 'N/A'),
    },
    {
      field: 'area.name',
      headerName: t('managements.area'),
      width: 200,
      valueGetter: ({ row }: GridRenderCellParams) => get(row, 'area.name', 'N/A'),
    },
    {
      field: 'coach',
      headerName: t('managements.coach'),
      width: 200,
    },
    {
      field: 'charge',
      headerName: t('managements.charge'),
      width: 200,
    },
    {
      field: 'employeeType',
      headerName: t('managements.employeeType'),
      width: 200,
    },
    {
      field: 'costCenter',
      headerName: t('managements.costsCenter'),
      width: 200,
    },
    {
      field: 'birthDate',
      headerName: t('managements.birthDate'),
      width: 200,
      type: 'date',
      renderCell: ({ value }: GridRenderCellParams) => (value ? dayjs(value).format('YYYY-MM-DD') : 'N/A'),
    },
    {
      field: 'darwinUser',
      headerName: t('managements.darwinUser'),
      width: 200,
    },
    {
      field: 'rbSystemsUser',
      headerName: t('managements.rbSystemsUser'),
      width: 200,
    },
    {
      field: 'lastLogin',
      headerName: t('managements.lastLogin'),
      width: 200,
      type: 'date',
      renderCell: ({ value }: GridRenderCellParams) => (value ? dayjs(value).format('YYYY-MM-DD hh:mm:ss A') : 'N/A'),
    },
    {
      field: 'actions',
      headerName: '',
      width: 120,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (record: GridRenderCellParams) => {
        if (hoveredRowId === record.id) {
          return (
            <Stack direction="row">
              <Tooltip title={record.row.active ? t('managements.disabled') : t('managements.enable')} placement="top">
                <IconButton
                  onClick={() => {
                    setUserSelected({
                      id: record?.id?.toString() || '',
                      name: record.row.name,
                      lastName: record.row.lastName,
                      active: record.row.active,
                    });
                    setOpenModal(true);
                  }}
                >
                  {record.row.active ? <NoAccounts /> : <AccountCircle />}
                </IconButton>
              </Tooltip>
              <IconButton onClick={() => handleMenuClick('edit', String(record.id), record.row?.role?.id, record.row.companies)}>
                <EditIcon />
              </IconButton>
            </Stack>
          );
        }
        return null;
      },
    },
  ];

  return (
    <Container maxWidth="xl">
      <EnableOrDisabledModal
        user={userSelected}
        open={openModal}
        handleClose={() => setOpenModal(false)}
      />
      <Conditional
        loadable={openDrawer}
        initialComponent={null}
      >
        <CreateForm
          open={openDrawer}
          onClose={handleDrawerClose}
        />
      </Conditional>
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
                {t('managements.usersModule.edit_user')}
              </Typography>
              <CustomerUser
                onClose={handleEditCustomerClose}
                userId={openEditCustomer.userId}
                mode="edit"
                companiesSelected={openEditCustomer.companies}
              />
            </Stack>
          </Drawer>
        </Suspense>
      </Conditional>
      <Conditional
        loadable={Boolean(userId)}
        initialComponent={null}
      >
        <Suspense fallback={<h3>Loading...</h3>}>
          <UpdateForm
            open={Boolean(userId)}
            onClose={handleEditDrawerClose}
            userId={userId}
          />
        </Suspense>
      </Conditional>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleDrawerOpen}
        sx={{ height: 60, width: 200, marginBottom: '1%' }}
      >
        {t('managements.newUser')}
      </Button>
      <DataGrid
        onClearConfig={() => {
          setVariables({});
          setHasActiveStatusFilter(false);
        }}
        loading={query.isLoading || query.isFetching}
        columns={columns}
        rows={query.data?.rows}
        actions={[
          <CustomFilters
            key="custom-filters-id"
            t={t}
            setVariables={handleChangeActiveStatusFilter}
            variables={variables}
            customHandleChange={(option: number) => {
              setShowCompanies(option === 3);
            }}
          />,
          <IconButton key="more-id" size="large" onClick={handleRefresh} disabled={query.isFetching}>
            <CachedIcon width={20} height={20} />
          </IconButton>,
        ]}
        mode="server"
        serverOptions={{
          totalRowCount: query.data?.total || 0,
          handleChange: handleDataGridEvents,
        }}
        rowFunction={{
          onMouseEnter: onMouseEnterRow,
          onMouseLeave: onMouseLeaveRow,
        }}
        getDetailPanelContent={getDetailPanelContent}
        withDetail={showCompanies}
      />
    </Container>
  );
}
