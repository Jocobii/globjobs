import { gql, useQuery } from '@apollo/client';

export type Operations = {
  _id: string;
  number: string
};

export type PedimentoConsolidados = {
  gtznId?: string;
  patente: string;
  remesas: string;
  TipoApertura: string;
  aduana: string;
  pedimento: string;
  clave: string;
  referencia: string;
  claveSAP: string;
  cliente: string;
  FirmaConsolidado: string;
  FechaApertura: string;
  Semana: string;
  Nombre: string;
  Tipo: string;
  status: {
    name: string;
    color?: string;
  };
  tipo_operacion: string;
  mes: string;
  operations?: Operations[],
};

export type PedimentoResponse = {
  getPedimentosConsolidadosPaginated: {
    rows: PedimentoConsolidados[];
    page: number;
    pageSize: number;
    totalPages: number;
  }
};

export const mappedPedimentos = (pedimentos: PedimentoConsolidados[]) => pedimentos
  .map((pedimento) => ({
    ...pedimento,
    semana: pedimento.Semana,
    tipo_operacion: pedimento.Tipo,
  }));

export const PEDIMENTOS_QUERY = gql`
  query GetPedimentosConsolidados($params: ConsolidadosInput!, $page: Float) {
    getPedimentosConsolidadosPaginated(params: $params, page: $page) {
      rows {
        gtznId
        patente
        aduana
        pedimento
        clave
        referencia
        claveSAP
        cliente
        FirmaConsolidado
        FechaApertura
        Semana
        Nombre
        Tipo
        mes
        remesas
        TipoApertura
        status {
          name
          color
        }
      }
      page
      pageSize
      totalPages
    }
  }
`;

type FilterOption = {
  variables?: Record<string, unknown>;
};

export const useGetPedimentos = (
  { variables }: FilterOption,
) => {
  const { data, loading, refetch } = useQuery<PedimentoResponse>(PEDIMENTOS_QUERY, {
    variables,
  });

  return {
    data: mappedPedimentos(data?.getPedimentosConsolidadosPaginated?.rows ?? []) ?? [],
    page: data?.getPedimentosConsolidadosPaginated?.page ?? 0,
    pageSize: data?.getPedimentosConsolidadosPaginated?.pageSize ?? 0,
    totalPages: data?.getPedimentosConsolidadosPaginated?.totalPages ?? 0,
    loading,
    refetch,
  };
};
