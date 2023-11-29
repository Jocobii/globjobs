import { gql, useQuery } from '@apollo/client';

export type Material = {
  material: string;
  textomaterial: string;
  unidadmedida: string;
  sociedad: string;
  grupoarticulo: string;
};

export type MaterialQuery = {
  getMaterial: Material[];
};

export const MATERIAL_QUERY = gql`
  query getMaterial {
    getMaterial {
      material
      textomaterial
      unidadmedida
      sociedad
      grupoarticulo
    }
  }
`;

export function useMaterial() {
  return useQuery<MaterialQuery>(MATERIAL_QUERY);
}
