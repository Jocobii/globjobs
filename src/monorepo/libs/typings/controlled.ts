import { FileDropZone as File } from '@gsuite/typings/files';
import { Dispatch, SetStateAction } from 'react';

export type InputOption = {
  value: string;
  title: string;
};

export type FieldType = 'text' | 'number' | 'color' | 'date' | 'file' | 'password' | 'select' | 'autocomplete';

export type FormInput = {
  label: string;
  type?: FieldType,
  helperText?: string;
  options?: InputOption[];
  keywords?: string[];
  multiline?: boolean;
  minRows?: number;
  customOnChange?: (value: any) => void,
  filesSetter?: Dispatch<SetStateAction<File[]>>;
  files?: File[];
  valueSerializer?: any;
  optionLabel?: any;
};

export type FieldColor = 'error' | 'success' | 'warning' | 'default' | 'primary';
