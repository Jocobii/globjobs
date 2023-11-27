import { FormProvider } from '../../context/FormContext';
import { Tabs } from './Tabs';

type Props = {
  edit?: boolean;
};
export default function Form({
  edit,
}: Readonly<Props> = { edit: false }) {
  return (
    <FormProvider>
      <Tabs edit={edit} />
    </FormProvider>
  );
}
