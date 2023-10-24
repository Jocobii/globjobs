import Drawer from '@mui/material/Drawer';
// import * as Yup from 'yup';

// import { SubmitHandler, useForm, FieldValues } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// import UsersForm from './components/UsersForm';
// import { useCreateUser } from './api/createUser';

type Props = {
  open: boolean;
  onClose: () => void;
};

const DRAWER_WIDTH = 600;

// const errMessage = 'Field is required';

export default function Create({ open, onClose }: Props) {
  // const { mutateAsync } = useCreateUser();
  // const schema = Yup.object({
  //   name: Yup.string().required(errMessage),
  //   lastName: Yup.string().required(errMessage),
  //   emailAddress: Yup.string().required(errMessage).typeError(errMessage),
  //   employeeNumber: Yup.string().required(errMessage),
  //   birthDate: Yup.string().required(errMessage),
  //   phoneNumber: Yup.string().required(errMessage),
  //   headquarter: Yup.object({}).required(errMessage),
  //   department: Yup.object({}).required(errMessage),
  //   area: Yup.object({}).required(errMessage),
  //   coach: Yup.string().required(errMessage),
  //   charge: Yup.string().required(errMessage),
  //   employeeType: Yup.string().required(errMessage),
  //   costCenter: Yup.string().required(errMessage),
  //   darwinUser: Yup.string().required(errMessage),
  //   rbSystemsUser: Yup.string().required(errMessage),
  // });

  // const {
  //   // handleSubmit,
  //   // register,
  //   // control,
  //   formState: { errors, isSubmitting },
  //   // reset,
  //   // getValues,
  //   // setValue,
  //   // watch,
  // } = useForm<FieldValues>({
  //   resolver: yupResolver(schema),
  // });

  // const onSubmit: SubmitHandler<any> = async (data) => {
  //   await mutateAsync({ data });
  //   reset();
  //   onClose();
  // };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { pb: 5, width: DRAWER_WIDTH } }}
      anchor="right"
      ModalProps={{
        keepMounted: false,
      }}
    >
      Form Create Role
    </Drawer>
  );
}
