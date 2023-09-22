import { request, gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";

import type { Menu } from "@/typings/menu";

type RestfulMenusResponse = {
  menusByEnvironment: Array<Partial<Menu>>;
};

const restfulMenusDocument = gql`
  query ($environment: String!) {
    menusByEnvironment(environment: $environment) {
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

export const restfulMenus = async (
  variables: Record<string, unknown>
): Promise<RestfulMenusResponse> =>
  request("/gq/back-office", restfulMenusDocument, {
    ...variables,
  });

type UseRestfulMenusOptions = {
  variables?: Record<string, unknown>;
};

export function useRestfulMenus({ variables }: UseRestfulMenusOptions = {}) {
  return useQuery({
    queryKey: ["restful-environments"],
    queryFn: () => restfulMenus(variables || {}),
  });
}
