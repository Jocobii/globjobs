import { useMemo } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import _ from 'lodash';

export type VerifyInvoice = {
  client: string;
  bol: string;
  invoice: string;
  reference: string;
  invoiceDate: Date;
  material: string;
  amount: number;
  trafNumber: string;
  trafReference: string;
  trafReferences2: string;
  pedimento: string;
};

export const VERIFY_TRANSIT_RB = gql`
  query($transit: TransitInput){
    transit(transitInfo: $transit){
      client
      bol
      invoice
      reference
      invoiceDate
      material
      amount
      trafNumber
      trafReference
      trafReferences2
      pedimento
    }
  }
`;

export const VERIFY_INBOND_RB = gql`
  query($inbond: String!, $customer: String!){
    inbondCheck(inbond: $inbond, customer: $customer){
      inbond
      exists
    }
  }
`;

export const VERIFY_SHIPPER_RB = gql`
  query($shipper: String!){
    shipperCheck(shipper: $shipper){
      shipper
      exists
      invoice
    }
  }
`;

export const useInbondValidation = () => {
  const [inbondCheck, { loading, data, error }] = useLazyQuery(VERIFY_INBOND_RB);
  const isValid = data && !loading && !error;

  const hasError = !loading && !!error;

  const debouncedValidation = useMemo(() => {
    const validateInbond = async (value = '', customer = '') => {
      await inbondCheck({
        variables: {
          inbond: value,
          customer,
        },
      });
    };
    return _.debounce(validateInbond, 2000);
  }, [inbondCheck]);

  return {
    loading,
    data,
    isValid,
    hasError,
    debouncedValidation,
  };
};

export const useInvoiceValidation = () => {
  const [transit, { loading, data, error }] = useLazyQuery(VERIFY_TRANSIT_RB);
  const isValid = data?.invoices?.client && !loading && !error;

  const hasError = !loading && !!error;

  const debouncedValidation = useMemo(() => {
    const validateTransit = async (value = '') => {
      await transit({
        variables: {
          transit: {
            transit: value,
          },
        },
      });
    };
    return _.debounce(validateTransit, 2000);
  }, [transit]);

  return {
    loading,
    data,
    isValid,
    hasError,
    debouncedValidation,
  };
};

export const useShipperValidation = () => {
  const [shipperCheck, { loading, data, error }] = useLazyQuery(VERIFY_SHIPPER_RB);
  const hasError = !loading && !!error;
  const isValid = data && !loading && !error;

  const debouncedValidation = useMemo(() => {
    const validateShipper = async (value = '') => {
      await shipperCheck({
        variables: {
          shipper: value,
        },
      });
    };
    return _.debounce(validateShipper, 2000);
  }, [shipperCheck]);

  return {
    loading,
    data,
    isValid,
    hasError,
    debouncedValidation,
  };
};
