import { Navigate } from 'react-router-dom';

import useAuthentication from '@/hooks/useAuthentication';

type PublicGuardProps = {
  children: JSX.Element | Array<JSX.Element>;
  redirectTo?: string;
};

export default function PublicGuard({ children, redirectTo = '/g/ops' }: PublicGuardProps) {
  const { isAuthenticated, accessToken } = useAuthentication();

  if (isAuthenticated && accessToken) {
    return <Navigate to={redirectTo} />;
  }

  return (
    <>
      {children}
    </>
  );
}
