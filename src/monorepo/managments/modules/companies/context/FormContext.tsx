import { createContext, useState, useMemo } from 'react';

export interface ContextProps {
  children: JSX.Element;
}

export type ContextValues = {
  tab: string;
  handleChangeTab: (__: unknown, value: string) => void;
  typeSelect: string;
  onChangeTypeSelect: (value: string) => void;
  disableEntryInvoice: boolean;
  disableEntrySupplier: boolean;
  disableShippingInvoice: boolean;
  disableShippingSupplier: boolean;
  changeDisableEntryInvoice: (value: boolean) => void;
  changeDisableEntrySupplier: (value: boolean) => void;
  changeDisableShippingInvoice: (value: boolean) => void;
  changeDisableShippingSupplier: (value: boolean) => void;
};

export const FormContext = createContext<ContextValues>({
  tab: '1',
  typeSelect: '',
  disableEntryInvoice: false,
  disableEntrySupplier: false,
  disableShippingInvoice: false,
  disableShippingSupplier: false,
  onChangeTypeSelect: () => null,
  handleChangeTab: () => null,
  changeDisableEntryInvoice: () => null,
  changeDisableEntrySupplier: () => null,
  changeDisableShippingInvoice: () => null,
  changeDisableShippingSupplier: () => null,
});

export function FormProvider({ children }: Readonly<ContextProps>) {
  const [tab, setTab] = useState('1');
  const [typeSelect, setTypeSelect] = useState('');
  const [disableEntryInvoice, setDisableEntryInvoice] = useState(false);
  const [disableEntrySupplier, setDisableEntrySupplier] = useState(false);
  const [disableShippingInvoice, setDisableShippingInvoice] = useState(false);
  const [disableShippingSupplier, setDisableShippingSupplier] = useState(false);
  const values = useMemo<ContextValues>(
    () => ({
      tab,
      handleChangeTab: (_, value) => setTab(value),
      typeSelect,
      onChangeTypeSelect: (value) => setTypeSelect(value),
      disableEntryInvoice,
      disableEntrySupplier,
      disableShippingInvoice,
      disableShippingSupplier,
      changeDisableEntryInvoice: (value) => setDisableEntryInvoice(value),
      changeDisableEntrySupplier: (value) => setDisableEntrySupplier(value),
      changeDisableShippingInvoice: (value) => setDisableShippingInvoice(value),
      changeDisableShippingSupplier: (value) => setDisableShippingSupplier(value),
    }),
    [
      tab,
      typeSelect,
      disableEntryInvoice,
      disableEntrySupplier, disableShippingInvoice, disableShippingSupplier,
    ],
  );

  return (
    <FormContext.Provider value={values}>
      {children}
    </FormContext.Provider>
  );
}
