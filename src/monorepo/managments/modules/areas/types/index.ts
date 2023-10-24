import type { FieldErrors, UseFormRegister, Control } from 'react-hook-form/dist/types';
import {
  object,
  string,
  InferType,
} from 'yup';

export type BaseEntity = {
  id: string;
  createdAt: number;
};

export const areaSchema = object().shape({
  name: string().required(),
  abbreviation: string().required(),
  department: object({}).required(),
});

export type Area = InferType<typeof areaSchema>;

export type IArea = Area & BaseEntity;

export type CreateAreaDTO = {
  data: Area;
};

export type AreaCreateFormProps = {
  handleSubmit: any;
  errors: FieldErrors;
  register: UseFormRegister<Area>;
  control: Control<Area>;
  isSubmitting?: boolean;
  isEditing?: boolean,
  data?: any,
};

export type CreateDrawerProps = {
  open: boolean;
  onClose: () => void;
};
export type Department = {
  _id: string;
  name: string;
  abbreviation: string;
  email: string;
};

export type UpdateAreaDTO = {
  data: Partial<Area>;
  areaId: string;
};

export type UpdateDrawerProps = {
  open: boolean;
  onClose: () => void;
  areaId: string;
};

export type AreaResponse = {
  department: Department;
} & IArea;