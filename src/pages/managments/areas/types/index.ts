import type { FieldErrors, UseFormRegister, Control } from 'react-hook-form';
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
  name: string().required().min(3).max(100),
  abbreviation: string().required().min(2).max(15),
  department: object({
    id: string().required(),
    name: string().required(),
  }).required(),
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
