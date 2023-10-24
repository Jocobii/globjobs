import { DeepPartial, SubmitHandler } from 'react-hook-form';

import { Formeazy } from '@gsuite/ui/Formeazy';
import { Dialogeazy } from '@gsuite/ui/Dialogeazy';

import { useRule, useCreateRule, useUpdateRule } from './api';
import { RuleSchema, Rule } from './types';

type BaseProps = {
  onClose: () => void;
};

type UpdateProps = {
  ruleId: string;
} & BaseProps;

type Props = {
  open: boolean;
  ruleId?: string | null;
} & BaseProps;

type FormProps = {
  initialValues?: DeepPartial<Rule>;
  onSubmit: SubmitHandler<Rule>;
} & BaseProps;

type Operator = {
  title: string;
  value: string;
};

const operators : Operator [] = [
  {
    title: 'Si es vacio',
    value: 'null',
  },
  {
    title: 'Si es diferente de vacio',
    value: '!null',
  },
  {
    title: 'Si es un numero',
    value: 'number',
  },
  {
    title: 'Si no es numero',
    value: '!number',
  },
  {
    title: 'Si es un texto',
    value: 'string',
  },
  {
    title: 'Si no es un texto',
    value: '!string',
  },
  {
    title: 'Si es menor que',
    value: '<[value]',
  },
  {
    title: 'Si es mayor que',
    value: '>[value]',
  },
  {
    title: 'Si es menor o igual que',
    value: '<=[value]',
  },
  {
    title: 'Si es mayor o igual que',
    value: '>=[value]',
  },
  {
    title: 'Si es diferente de',
    value: '!==[value]',
  },
  {
    title: 'Si es igual a',
    value: '===[value]',
  },
];

const sections = [
  {
    title: '501',
    value: '501',
  },
  {
    title: '502',
    value: '502',
  },
  {
    title: '504',
    value: '504',
  },
  {
    title: '505',
    value: '505',
  },
  {
    title: '516',
    value: '516',
  },
  {
    title: '551',
    value: '551',
  },
  {
    title: '999',
    value: '999',
  },
];

function RuleForm({ initialValues = {}, onSubmit, onClose }: FormProps) {
  return (
    <Formeazy<Rule>
      withHeader
      title="Crear regla para el TXT"
      schema={RuleSchema}
      inputProps={{
        field: {
          label: 'Numero de campo del TXT',
          type: 'number',
          helperText: 'Se empieza desde 1, de izquierda a derecha del TXT. Ejemplo si queremos validar la clave de pedimento de la seccion 501, seria el campo 4',
        },
        message: {
          label: 'Mensaje de la regla',
        },
        section: {
          label: 'Section del TXT',
          type: 'select',
          options: sections,
        },
        type: {
          label: 'Tipo de regla',
          type: 'select',
          options: [
            { value: 'warning', title: 'Advertencia' },
            { value: 'error', title: 'Error' },
            { value: 'information', title: 'Informativo' },
          ],
        },
        validator: {
          label: 'Operador logico',
          type: 'select',
          options: operators,
        },
      }}
      initialValues={initialValues}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  );
}

function UpdateContent({ ruleId, onClose }: UpdateProps) {
  const ruleQuery = useRule({ ruleId });
  const { mutateAsync } = useUpdateRule();

  const onSubmit = async (data: Rule) => {
    await mutateAsync({ data, ruleId });

    onClose();
  };

  return <RuleForm initialValues={ruleQuery.data} onSubmit={onSubmit} onClose={onClose} />;
}

function CreateContent({ onClose }: BaseProps) {
  const { mutateAsync } = useCreateRule();

  const onSubmit = async (data: Rule) => {
    await mutateAsync({ data });

    onClose();
  };

  return <RuleForm onSubmit={onSubmit} onClose={onClose} />;
}

export default function DrawerForm({ open, onClose, ruleId = null }: Props) {
  return (
    <Dialogeazy
      open={open}
      onClose={onClose}
    >
      {
      ruleId && ruleId !== 'create'
        ? <UpdateContent ruleId={ruleId} onClose={onClose} />
        : <CreateContent onClose={onClose} />
      }
    </Dialogeazy>
  );
}
