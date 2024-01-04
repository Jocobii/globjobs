import { Formeazy } from '@gsuite/ui/Formeazy';
import { Dialogeazy } from '@gsuite/ui/Dialogeazy';
import { t } from 'i18next';

import { useRule, useCreateRule, useUpdateRule } from '../api';
import { RuleSchema, Rule, Props } from '../types';
import { FIELD_FORM_EASY } from '../utils/const';

export default function DrawerForm({ open, onClose, ruleId = undefined }: Props) {
  const { data } = useRule({ ruleId });
  const { mutateAsync: updatedRule } = useUpdateRule();
  const { mutateAsync: createRule } = useCreateRule();
  const isUpdate = ruleId && ruleId !== 'create';
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const handleSubmit = (data: Rule) => {
    if (isUpdate) {
      updatedRule({ data, ruleId });
    } else {
      createRule({ data });
    }
    onClose();
  };

  return (
    <Dialogeazy
      open={open}
      onClose={onClose}
    >
      <Formeazy<Rule>
        withHeader
        title={isUpdate ? t('managements.rules.edit_rule') : t('managements.rules.create_rule')}
        schema={RuleSchema}
        inputProps={FIELD_FORM_EASY}
        initialValues={data ?? {}}
        onSubmit={handleSubmit}
        onClose={onClose}
      />
    </Dialogeazy>
  );
}
