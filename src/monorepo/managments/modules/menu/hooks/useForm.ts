import { useState } from 'react';

import { useRestfulEnvironments } from '../../modules/api/getEnvironments';
import { useRestfulModules } from '../../modules/api/getModulesRestful';
import { Module } from '../types';

type Environment = {
  id: string;
};

export function useForm() {
  const { data: environmentsData } = useRestfulEnvironments();
  const { data: modulesData } = useRestfulModules();
  const [nameVisible, setNameFieldVisible] = useState(false);
  const [environmentFieldDisabled, setEnvironmentDisabled] = useState(false);
  const [modulesFieldDisabled, setModulesFieldDisabled] = useState(true);
  const [modulesOptions, setModulesOptions] = useState(modulesData?.modulesRestful || []);

  const filterModules = (environment: Environment) => {
    setModulesFieldDisabled(false);
    if (modulesData) {
      setModulesOptions(
        modulesData.modulesRestful
          .filter((row: Partial<Module>) => row.environment && row.environment.id === environment.id),
      );
    }
  };

  const changeModule = (modules: Partial<Module[]>) => {
    setNameFieldVisible(modules.length > 1);
    setEnvironmentDisabled(!!modules.length);
  };

  return {
    nameVisible,
    setNameFieldVisible,
    environmentFieldDisabled,
    setEnvironmentDisabled,
    environmentsData,
    modulesOptions,
    filterModules,
    modulesFieldDisabled,
    changeModule,
  };
}
