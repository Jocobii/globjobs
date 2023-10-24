import { gql, useQuery } from '@apollo/client';

export const PAGINATE_REMESAS_BY_CROSSING = gql`
query($crossingId: String!, $paginationInput: PaginationDtoInput) {
  remesasByCrossing(crossingId: $crossingId, paginationInput: $paginationInput) {
    rows {
      factura
      aduana
      fecha
      fechaDePagoBanco
      numero
      patente
      pedimento
      tipo
    }
    page
    pageSize
    total
    totalPages
  }
}
`;

export function useRemesasByCrossing(crossingId: string, variables?: Record<string, unknown>) {
  const {
    data, loading, error, fetchMore, refetch,
  } = useQuery(PAGINATE_REMESAS_BY_CROSSING, {
    variables: {
      paginationInput: {
        ...variables,
      },
      crossingId,
    },
    context: { clientName: 'globalization' },
  });

  return {
    fetchMore,
    data,
    loading,
    error,
    refetch,
  };
}
