import { Navigate, useRoutes } from 'react-router-dom';
import loadable from '@loadable/component';
import DashboardLayout from '@/layouts/DashboardLayout';
import LogoOnlyLayout from '@/layouts/LogoOnlyLayout';

import LoadingScreen from '@/components/LoadingScreen';

const Broker = loadable(() => import('../pages/Broker'), {
  fallback: <LoadingScreen />,
});

const CrucesHome = loadable(() => import('../pages/cruces/Home'), {
  fallback: <LoadingScreen />,
});

const CreateCruce = loadable(() => import('../pages/cruces/pages/Create/Create'), {
  fallback: <LoadingScreen />,
});

const SuiteUiComponents = loadable(() => import('../pages/ui/Main'), {
  fallback: <LoadingScreen />,
});

const MenuModule = loadable(() => import('@monorepo/managments/modules/menu'), {
  fallback: <LoadingScreen />,
});

const CompanyModule = loadable(() => import('@monorepo/managments/modules/companies'), {
  fallback: <LoadingScreen />,
});

const CompanyDetail = loadable(() => import('@monorepo/managments/modules/companies/Detail'), {
  fallback: <LoadingScreen />,
});

const CompanyUpdate = loadable(() => import('@monorepo/managments/modules/companies/Detail'), {
  fallback: <LoadingScreen />,
});

const Headquarters = loadable(() => import('@monorepo/managments/modules/headquarters/List'), {
  fallback: <LoadingScreen />,
});

const Teams = loadable(() => import('@monorepo/managments/modules/teams/List'), {
  fallback: <LoadingScreen />,
});

const Departments = loadable(() => import('@monorepo/managments/modules/departments/List'), {
  fallback: <LoadingScreen />,
});

const AreasHome = loadable(() => import('@monorepo/managments/modules/areas'), {
  fallback: <LoadingScreen />,
});

const Rules = loadable(() => import('@monorepo/managments/modules/rules/List'), {
  fallback: <LoadingScreen />,
});

const Modules = loadable(() => import('@monorepo/managments/modules/modules'), {
  fallback: <LoadingScreen />,
});

const Roles = loadable(() => import('@monorepo/managments/modules/roles'), {
  fallback: <LoadingScreen />,
});

const UsersHome = loadable(() => import('@monorepo/managments/modules/users'), {
  fallback: <LoadingScreen />,
});

const NotFound = loadable(() => import('../pages/NotFound'), {
  fallback: <LoadingScreen />,
});

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to="/g" replace />,
    },
    {
      path: 'g',
      element: (<DashboardLayout />),
      children: [
        { element: <Navigate to="/g/ops" replace />, index: true },
        {
          path: 'ops',
          element: <Broker />,
        },
        {
          path: 'ops/status/:status',
          element: <Broker />,
        },
      ],
    },
    {
      path: 'cruces',
      element: (<DashboardLayout />),
      children: [
        { element: <Navigate to="/cruces/all" replace />, index: true },
        {
          path: '/cruces/all',
          element: <CrucesHome />,
        },
        {
          path: '/cruces/create/:id',
          element: <CreateCruce />,
        },
      ],
    },
    {
      path: 'ui',
      element: (<DashboardLayout />),
      children: [
        { element: <Navigate to="/ui/components" replace />, index: true },
        {
          path: '/ui/components',
          element: <SuiteUiComponents />,
        }
      ],
    },
    {
      path: 'm',
      element: (<DashboardLayout />),
      children: [
        { element: <Navigate to="/m/company" replace />, index: true },
        { path: 'company', element: <CompanyModule /> },
        {
          path: 'company/detail/:id',
          element: <CompanyDetail />,
        },
        {
          path: 'company/update/:id',
          element: <CompanyUpdate edit />,
        },
        { path: 'headquarters', element: <Headquarters /> },
        {
          path: 'teams',
          element: <Teams />,
        },
        {
          path: 'departments',
          element: <Departments />,
        },
        {
          path: 'users',
          element: <UsersHome />,
        },
        {
          path: 'areas',
          element: <AreasHome />,
        },
        {
          path: 'rules',
          element: <Rules />,
        },
        {
          path: 'roles',
          element: <Roles />,
        },
        {
          path: 'modules',
          element: <Modules />,
        },
        {
          path: 'menu',
          element: <MenuModule />,
        },
      ],
    },
    {
      path: 'f',
      element: (<DashboardLayout />),
      children: [
        { element: <Navigate to="/f/adp" replace />, index: true },
        // {
        //   path: 'adp',
        //   element: <AdpHome />,
        // },
      ],
    },
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
