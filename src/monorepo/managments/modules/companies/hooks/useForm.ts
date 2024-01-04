import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Companies, companySchema } from '../types';
import { useGetCompany } from '../api/getCompany';
import { useGetSAPCompany } from '../api/getSAPCompany';
import { useUpdateCompany } from '../api/updateCompany';
import { useCreateCompany } from '../api/createCompany';
import { FormContext } from '../context/FormContext';
import {
  UENS_OPTIONS,
  COMPLEMENTARY_ADP_DOCUMENTS,
  EXPORT, IMPORT,
  MANDATORY_ADP_DOCUMENTS,
  UENS_DEFAULT,
} from '../utils/constants';
import { parseCompany } from '../utils';

type Params = {
  id: string;
};

type Props = {
  edit?: boolean;
};

export default function useFormHook({
  edit = false,
}: Props) {
  const navigate = useNavigate();
  const { id } = useParams<keyof Params>();
  const {
    onChangeTypeSelect,
    changeDisableEntryInvoice,
    changeDisableEntrySupplier,
    changeDisableShippingInvoice,
    changeDisableShippingSupplier,
  } = useContext(FormContext);
  const { data } = useGetCompany({ number: id, isUpdate: edit });
  const { isLoading, data: companySap } = useGetSAPCompany({ number: id });
  const { mutateAsync: updateCompanyMutateAsync, isLoading: loadingUpdate } = useUpdateCompany({ number: id ?? '' });
  const { mutateAsync: createCompanyMutateAsync, isLoading: loadingCreate } = useCreateCompany();
  const [sectors, setSectors] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [paymentDefault, setPaymentDefault] = useState('');
  const [merchandiseOption, setMerchandiseOption] = useState('');
  const [uenSelected, setUenSelected] = useState<typeof UENS_OPTIONS>([]);

  const {
    register,
    control,
    formState: { errors },
    watch,
    reset,
    handleSubmit,
  } = useForm<Companies>({
    resolver: yupResolver<Companies>(companySchema),
  });

  watch(({
    // eslint-disable-next-line @typescript-eslint/no-shadow
    type, sectors, defaultPaymentMethod, merchandiseOption, uens,
  }) => {
    const uensOptions = UENS_OPTIONS.filter(({ key }) => {
      if (!uens) return false;
      const uen = uens[key];
      if (!uen) return false;
      return uen?.active;
    });
    onChangeTypeSelect(type ?? '');
    setSectors(sectors ?? false);
    setPaymentDefault(defaultPaymentMethod ?? '');
    setMerchandiseOption(merchandiseOption ?? '');
    setUenSelected(uensOptions ?? []);
    changeDisableEntryInvoice(uens?.aaus?.entrySupplier ?? false);
    changeDisableEntrySupplier(uens?.aaus?.entryInvoice ?? false);
    changeDisableShippingInvoice(uens?.aaus?.shipperSupplier ?? false);
    changeDisableShippingSupplier(uens?.aaus?.shipperInvoice ?? false);
  });

  useEffect(() => {
    if (!edit && companySap) {
      reset({
        ...parseCompany(companySap),
        type: '',
        import: IMPORT,
        export: EXPORT,
        mandatoryADPDocuments: MANDATORY_ADP_DOCUMENTS,
        complementaryADPDocuments: COMPLEMENTARY_ADP_DOCUMENTS,
        uens: UENS_DEFAULT,
      });
    }
  }, [companySap, reset, edit]);

  useEffect(() => {
    if (edit && data && companySap) {
      reset({
        ...data,
        ...parseCompany(companySap),
      });
    }
  }, [companySap, data, reset, edit]);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const onSubmit = async (data: Companies) => {
    if (edit && !openConfirm) {
      setOpenConfirm(true);
      return;
    }
    if (edit) {
      updateCompanyMutateAsync({
        data,
        number: id,
      });
      setOpenConfirm(false);
    } else {
      await createCompanyMutateAsync({ data });
      navigate(`/m/company/update/${data.number}`);
    }
  };

  const handleCancel = () => navigate(-1);
  const handleCancelConfirm = () => setOpenConfirm(false);

  return {
    register,
    control,
    errors,
    watch,
    reset,
    handleSubmit,
    sectors,
    paymentDefault,
    merchandiseOption,
    uenSelected,
    isLoading,
    openConfirm,
    loadingSubmit: loadingUpdate || loadingCreate,
    handleCancelConfirm,
    onSubmit,
    handleCancel,
    companyName: data?.name ?? '',
  };
}
