import _ from 'lodash';
import { MenuElement, Module } from '../typings/menu';

const getElements = (data: MenuElement[]) => data.map((row: MenuElement) => {
  const { modules, icon } = row;
  const hasModules = !!modules;
  const hasChildrens = hasModules && modules.length > 1;

  return {
    subheader: row.name,
    items: [
      {
        title: row.name,
        path: (hasModules && !hasChildrens && _.first(modules)?.route) || '',
        icon,
        ...(modules
            && modules.length > 1
            && {
              children: modules.map((moduleRow: Module) => ({
                title: moduleRow.name,
                path: moduleRow.route,
                icon: moduleRow.icon,
              })),
            }
        ),
      },
    ],
  };
});

export const navigationBarConfigData = (data: MenuElement[]) => getElements(data);
