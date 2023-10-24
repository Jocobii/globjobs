import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, UseFormProps, UseFormReturn } from 'react-hook-form';

export function useFormWithSchema<T extends Yup.AnyObjectSchema>(
  schema: T,
  useFormProps?: UseFormProps<Yup.Asserts<T>>,
): UseFormReturn<Yup.Asserts<T>> {
  return useForm({ ...useFormProps, resolver: yupResolver(schema) });
}

export function useFormWithSchemaBuilder<T extends Yup.AnyObjectSchema>(
  schemaBuilder: (yup: typeof Yup) => T,
  useFormProps?: UseFormProps<Yup.Asserts<T>>,
): UseFormReturn<Yup.Asserts<T>> {
  return useForm({ ...useFormProps, resolver: yupResolver(schemaBuilder(Yup)) });
}
