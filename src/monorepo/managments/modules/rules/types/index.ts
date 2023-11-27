import {
  object,
  string,
  number,
  mixed,
  boolean,
  InferType,
} from 'yup';

export type RuleType = 'error' | 'warning' | 'information';

export type OperatorType = 'null' | '!null' | 'number' | '!number' | 'string' | '!string' | '<[value]' | '>[value]' | '<=[value]' | '>=[value]' | '!==[value]' | '===[value]';

export type SectionType = '501' | '502' | '504' | '505' | '516' | '551' | '999';

export type BaseEntity = {
  id: string;
  createdAt: number;
};

export const RuleSchema = object().shape({
  section: mixed<SectionType>().oneOf(['501', '502', '504', '505', '516', '551', '999']).defined().required(),
  field: number().required(),
  type: mixed<RuleType>().oneOf(['error', 'warning', 'information']).defined().required(),
  validator: mixed<OperatorType>().oneOf(['null', '!null', 'number', '!number', 'string', '!string', '<[value]', '>[value]', '<=[value]', '>=[value]', '!==[value]', '===[value]']).defined().required(),
  message: string().required(),
  active: boolean(),
});

export type Rule = InferType<typeof RuleSchema>;

export type IRule = Rule & BaseEntity;

export type PaginateRules = {
  rows: IRule[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type Props = {
  open: boolean;
  ruleId?: string;
  onClose: () => void;
};
