import { Navigate } from 'react-router-dom';

import useAuthentication from '../hooks/useAuthentication';

type AuthGuardProps = {
  children: JSX.Element | Array<JSX.Element>;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, accessToken } = useAuthentication();

  if (!isAuthenticated || !accessToken) {
    return <Navigate to="/auth/login" />;
  }

  return children;
}
