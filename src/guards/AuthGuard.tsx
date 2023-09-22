import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import LoadingScreen from '../components/LoadingScreen';
import { environment, PATH_AUTH } from '../routes/paths';

type Props = {
  children: React.ReactNode;
  AppEnvironment?: string;
};

export default function AuthGuard({ children, AppEnvironment = environment }: Props) {
  const { isInitialized } = useAuth();
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    (async () => {
      let hasSession = false;
      try {
        const response = await fetch(PATH_AUTH.api, {
          credentials: 'include',
        });

        const data = await response.json();
        hasSession = !!data.user;
      } catch (e) {
        hasSession = false;
      }

      if (!hasSession) {
        window.location.href = `${PATH_AUTH.login}?env=${AppEnvironment}`;
      }

      setAuthenticated(hasSession);
    })();
  }, [AppEnvironment]);

  if (!isInitialized || !isAuthenticated) return <LoadingScreen />;

  return children as JSX.Element;
}
