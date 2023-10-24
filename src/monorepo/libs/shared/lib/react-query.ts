// Si lo ves, haste el 👨‍🦯
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import {
  QueryClient,
  UseQueryOptions,
  UseMutationOptions,
  DefaultOptions,
} from '@tanstack/react-query';

const queryConfig: DefaultOptions = {
  queries: {
    useErrorBoundary: true,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 30000,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

export type ExtractFnReturnType<FnType extends (...args: any) => any> =
Awaited<ReturnType<FnType>>;

export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<UseQueryOptions<ExtractFnReturnType<QueryFnType>>, 'queryKey' | 'queryFn'>;

export type MutationConfig<MutationFnType extends (...args: any) => any> =
UseMutationOptions<ExtractFnReturnType<MutationFnType>, AxiosError, Parameters<MutationFnType>[0]>;
