import { gql, useQuery } from '@apollo/client';

export const PEDIMENTOS_RT_QUERY = gql`
query{
  getRTPedimentos{
    Numero
    patente
    aduana
    pedimento
    clave
    referencia
    nombre
    FirmaConsolidado
    FechaApertura
    Semana
  }
}
`;

export const usePedimentosList = () => {
  const {
    data, loading, error, refetch, fetchMore,
  } = useQuery(PEDIMENTOS_RT_QUERY, {
    context: { clientName: 'darwin' },
  });

  return {
    data,
    loading,
    error,
    refetch,
    fetchMore,
  };
};
