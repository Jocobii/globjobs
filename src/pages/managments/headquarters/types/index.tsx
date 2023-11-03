import {
  object,
  string,
  mixed,
  InferType,
  boolean,
} from 'yup';

export type BaseEntity = {
  id: string;
  createdAt: number;
};

export const headquarterSchema = object().shape({
  id: string(),
  name: string().required(),
  type: mixed().oneOf(['Office', 'Warehouse']).required(),
  phone: string().required(),
  address: object().shape({
    address1: string().required(),
    address2: string(),
    city: string(),
    state: string().required(),
    postalCode: string().required(),
    country: string().required(),
  }),
  active: boolean(),
});

export type Headquarter = InferType<typeof headquarterSchema>;

export type IHeadquarter = Headquarter & BaseEntity;
