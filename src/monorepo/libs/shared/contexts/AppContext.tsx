import {
  createContext, useMemo, useState, useEffect,
} from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import useResponsive from '../hooks/useResponsive';

export interface ContextProps {
  children: JSX.Element;
}

export type ContextValues = {
  mode: 'dark' | 'light';
  isCollapse: boolean;
  collapseClick: boolean;
  collapseHover: boolean;
  onToggleCollapse: () => void;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
  toggleColorMode: () => void;
};

export const DataContext = createContext<ContextValues>({
  mode: 'light',
  isCollapse: false,
  collapseClick: false,
  collapseHover: false,
  onToggleCollapse: () => null,
  onHoverEnter: () => null,
  onHoverLeave: () => null,
  toggleColorMode: () => null,
});

export function DataProvider({ children }: ContextProps) {
  const isDesktop = useResponsive('up', 'lg');
  const [appConfig, setAppConfig] = useLocalStorage('wms.config', {
    mode: 'light',
  });

  const [collapse, setCollapse] = useState({
    click: false,
    hover: false,
  });

  useEffect(() => {
    if (!isDesktop) {
      setCollapse({
        click: false,
        hover: false,
      });
    }
  }, [isDesktop]);

  const handleToggleCollapse = () => {
    setCollapse({ ...collapse, click: !collapse.click });
  };

  const handleHoverEnter = () => {
    if (collapse.click) {
      setCollapse({ ...collapse, hover: true });
    }
  };

  const handleHoverLeave = () => {
    setCollapse({ ...collapse, hover: false });
  };

  const value = useMemo<ContextValues>(
    () => ({
      mode: appConfig.mode,
      isCollapse: collapse.click && !collapse.hover,
      collapseClick: collapse.click,
      collapseHover: collapse.hover,
      onToggleCollapse: handleToggleCollapse,
      onHoverEnter: handleHoverEnter,
      onHoverLeave: handleHoverLeave,
      toggleColorMode: () => {
        setAppConfig({
          ...appConfig,
          mode: appConfig.mode === 'light' ? 'dark' : 'light',
        });
      },
      saveSession: (auth: object) => {
        setAppConfig({
          ...appConfig,
          ...auth,
        });
      },
      signOut: () => {
        setAppConfig({
          ...appConfig,
          token: null,
          selectedCompany: null,
        });
      },
      token: appConfig.token,
      profile: appConfig.profile,
    }),
    [appConfig, collapse],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export default DataProvider;
