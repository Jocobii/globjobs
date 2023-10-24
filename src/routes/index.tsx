import { Navigate, useRoutes } from 'react-router-dom';
import loadable from '@loadable/component';
import DashboardLayout from '@/layouts/DashboardLayout';
import LogoOnlyLayout from '@/layouts/LogoOnlyLayout';
import AuthGuard from '@/guards/AuthGuard';
import PublicGuard from '@/guards/PublicGuard';

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
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
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
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
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
    // {
    //   path: 'm',
    //   element: (
    //     <AuthGuard>
    //       <DashboardLayout />
    //     </AuthGuard>
    //   ),
    //   children: [
    //     { element: <Navigate to="/m/company" replace />, index: true },
    //     /* { path: 'company', element: <CompanyHome /> } */,
    //     // {
    //     //   path: 'company/detail/:id',
    //     //   element: <CompanyDetail />,
    //     // },
    //     /* { path: 'headquarters', element: <Headquarters /> } */,
    //     // {
    //     //   path: 'teams',
    //     //   element: <Teams />,
    //     // },
    //     // {
    //     //   path: 'departments',
    //     //   element: <Departments />,
    //     // },
    //     // {
    //     //   path: 'users',
    //     //   element: <UsersHome />,
    //     // },
    //     // {
    //     //   path: 'areas',
    //     //   element: <AreasHome />,
    //     // },
    //     // {
    //     //   path: 'rules',
    //     //   element: <Rules />,
    //     // },
    //     // {
    //     //   path: 'roles',
    //     //   element: <Roles />,
    //     // },
    //     // {
    //     //   path: 'modules',
    //     //   element: <Modules />,
    //     // },
    //     // {
    //     //   path: 'menu',
    //     //   element: <Menu />,
    //     // },
    //   ],
    // },
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
