import { gql, useQuery } from '@apollo/client';

export type CatalogQuery = {
  getCatalogs: {
    id: string;
    name: string;
    description: string;
    value: string[];
    module: string;
    active: boolean;
  }[]
};

export const CATALOG_QUERY = gql`
  query GetCatalogs ($catalog: String) {
  getCatalogs(catalog: $catalog) {
    id
    name
    description
    value
    module
    active
  }
}
`;

export const useGetCatalog = (catalog: string) => useQuery<CatalogQuery>(CATALOG_QUERY, {
  variables: { catalog },
  context: { clientName: 'globalization' },
});

export default useGetCatalog;
