import { useQuery, gql } from "@apollo/client";

import type { MenuElement } from "@/typings/menu";

type RestfulMenusResponse = {
  menusByEnvironment: Array<Partial<MenuElement>>;
};

const restfulMenusDocument = gql`
query($environment: String!, $getOnlyUserModules: Boolean!) {
  menusByEnvironment(environment: $environment, getOnlyUserModules: $getOnlyUserModules) {
      name
      modules {
          id
          name
          route
          component
          icon
          description
      }
      active
      order
      icon
      environment {
          id
          name
      }
  }
}
`;

export function useRestfulMenus() {
  const { data, loading, error } = useQuery<RestfulMenusResponse>(restfulMenusDocument, {
    variables: {
      environment: '633207ea9bfe2b1d9c586671',
      getOnlyUserModules: true,
    },
  });

  return {
    data,
    loading,
    error,
  };
}