import { Navigate, useRoutes } from 'react-router-dom';
import loadable from '@loadable/component';
import DashboardLayout from '@/layouts/DashboardLayout';
import LogoOnlyLayout from '@/layouts/LogoOnlyLayout';
import PublicGuard from '@/guards/PublicGuard';

import LoadingScreen from '@/components/LoadingScreen';

const CrucesHome = loadable(() => import('@monorepo/cruces/app/page/Cruces'), {
  fallback: <LoadingScreen />,
});

const CrucesDetail = loadable(() => import('@monorepo/cruces/app/page/CruceDetail'), {
  fallback: <LoadingScreen />,
});

const RemoteTraffic = loadable(() => import('@monorepo/cruces/modules/traffic'), {
  fallback: <LoadingScreen />,
});

const RemoteTrafficDetail = loadable(() => import('@monorepo/cruces/modules/traffic/pages/detail'), {
  fallback: <LoadingScreen />,
});

const RemotePedimento = loadable(() => import('@monorepo/cruces/modules/pedimento'), {
  fallback: <LoadingScreen />,
});

const RemotePedimentoDetail = loadable(() => import('@monorepo/cruces/modules/pedimento/pages/detail'), {
  fallback: <LoadingScreen />,
});

const SuiteUiComponents = loadable(() => import('../pages/ui/Main'), {
  fallback: <LoadingScreen />,
});

const MenuModule = loadable(() => import('@monorepo/managments/modules/menu'), {
  fallback: <LoadingScreen />,
});

const AdpHome = loadable(() => import('@monorepo/managments/modules/adp'), {
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

const BrokerHome = loadable(() => import('@monorepo/broker/app/app'), {
  fallback: <LoadingScreen />,
});

const BrokerDetail = loadable(() => import('@monorepo/broker/app/page/GOPSDetail'), {
  fallback: <LoadingScreen />,
});

const RemoteBrokerReferences = loadable(() => import('@monorepo/broker/app/page/References'), {
  fallback: <LoadingScreen />,
});

const NotFound = loadable(() => import('../pages/NotFound'), {
  fallback: <LoadingScreen />,
});

const SignIn = loadable(() => import('../pages/auth/pages/SignIn'), {
  fallback: <LoadingScreen />,
})

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to="/g" replace />,
    },
    {
      path: 'auth',
      children: [
        { element: <Navigate to="/auth/login" replace />, index: true },
        {
          path: 'login',
          element: (
            <PublicGuard>
              <SignIn />
            </PublicGuard>
          ),
        }
      ],
    },
    {
      path: 'g',
      element: (<DashboardLayout/>),
      children: [
        { element: <Navigate to="/g/ops" replace />, index: true },
        {
          path: 'ops',
          element: <BrokerHome />,
        },
        {
          path: 'ops/references',
          element: <RemoteBrokerReferences />,
        },
        {
          path: 'ops/status/:status',
          element: <BrokerHome />,
        },
        {
          path: 'ops/detail/:id',
          element: <BrokerDetail />,
        },
      ],
    },
    {
      path: 'c',
      element: (<DashboardLayout />),
      children: [
        { element: <Navigate to="/c/cruces" replace />, index: true },
        {
          path: 'cruces',
          element: <CrucesHome />,
        },
        {
          path: 'cruces/detail/:id',
          element: <CrucesDetail />,
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
        {
          path: 'adp',
          element: <AdpHome />,
        },
      ],
    },
    {
      path: 't',
      element: (<DashboardLayout/>),
      children: [
        { element: <Navigate to="/t/operation/readyDocuments" replace />, index: true },
        {
          path: 'operation/:status',
          element: <RemoteTraffic />,
        },
        {
          path: 'operation/detail/:id',
          element: <RemoteTrafficDetail />,
        },
      ],
    },
    {
      path: 'p',
      element: (<DashboardLayout/>),
      children: [
        { element: <Navigate to="/p/pedimento" replace />, index: true },
        {
          path: 'pedimento',
          element: <RemotePedimento />,
        },
        {
          path: 'pedimento/:id',
          element: <RemotePedimentoDetail />,
        },
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
