import {
  object,
  string,
  InferType,
  boolean,
} from 'yup';

export type BaseEntity = {
  id: string;
  createdAt: number;
};

export const departmentSchema = object().shape({
  name: string().required(),
  abbreviation: string().required(),
  email: string().required(),
  active: boolean(),
});

export type Department = InferType<typeof departmentSchema>;

export type IDepartment = Department & BaseEntity;

export type Props = {
  open: boolean;
  departmentId?: string;
  onClose: () => void;
};
