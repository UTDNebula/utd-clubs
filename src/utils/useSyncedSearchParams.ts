'use client';
import { useRouter } from 'next/navigation';
import { useReducer } from 'react';
import EncodeParams from './encodeParams';

// not sure about the name, but basically makes updates to searchparams not overwrite themselves
const useSyncedSearchParams = <T extends Record<string, unknown>>(
  searchParams: T,
  route: string,
) => {
  const router = useRouter();
  const [params, setParams] = useReducer((state: T, action: Partial<T>) => {
    const temp = { ...state, ...action };
    router.push(`${route}?${EncodeParams(temp)}`);
    return temp;
  }, searchParams);
  return [params, setParams] as const;
};
export default useSyncedSearchParams;

export type useSyncedSearchParamsDispatch<T extends Record<string, unknown>> =
  ReturnType<typeof useSyncedSearchParams<T>>[1];
