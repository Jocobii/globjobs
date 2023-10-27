import {
  object,
  string,
  InferType,
} from 'yup';

import type {
  FieldErrors,
  UseFormRegister,
  Control,
} from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';
import { FileDropZone as File } from '@gsuite/typings/files';

export type BaseEntity = {
  id: string;
  createdAt: number;
};

export const redTeamSchema = object().shape({
  anden: object().shape({
    id: string().nullable(),
    name: string().nullable(),
  }),
  checker: object().shape({
    id: string().nullable(),
    name: string().nullable(),
  }),
  additionalComment: string().required(),
  docs: string(),
});

export type RedTeam = InferType<typeof redTeamSchema>;

export type IRedTeam = RedTeam & BaseEntity;

export type CreateRedTeamDTO = {
  data: RedTeam;
};

export type FileAttached = {
  id?: string;
  name?: string;
  ext?: string;
  url?: string;
};

export type DataAlert = {
  anden?: string;
  checker?: string;
  additionalComment?: string;
  teamId?: string;
  fileAttached?: FileAttached[]
};

export type AlertCreateFormProps = {
  handleSubmit?: any;
  errors: FieldErrors;
  register: UseFormRegister<RedTeam>;
  control: Control<RedTeam>;
  isSubmitting?: boolean;
  isEditing?: boolean,
  filesSetter?: Dispatch<SetStateAction<File[]>>;
  files?: File[];
  cruceNumber?: string;
  dataAlert?: DataAlert;
};

export type CreateDrawerProps = {
  open: boolean;
  onClose: () => void;
};
