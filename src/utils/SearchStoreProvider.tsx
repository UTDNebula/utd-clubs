'use client';

import { useSearchParams } from 'next/navigation';
import { createContext, useContext, useState } from 'react';
import { useStore } from 'zustand';
import {
  createSearchStore,
  defaultInitState,
  type SearchStore,
} from './searchStore';

export type SearchStoreApi = ReturnType<typeof createSearchStore>;

export const SearchStoreContext = createContext<SearchStoreApi | undefined>(
  undefined,
);

export const SearchStoreProvider = ({ children }: React.PropsWithChildren) => {
  const searchParams = useSearchParams();

  const [store] = useState(() => {
    const initialSearch = searchParams.get('search') ?? undefined;
    const tagsParam = searchParams.get('tags');
    const initialTags = tagsParam ? tagsParam.split(',') : undefined;
    const defaultInitStateWithParams = {
      ...defaultInitState,
      search: initialSearch ?? defaultInitState.search,
      tags: initialTags ?? defaultInitState.tags,
      shouldScrollDown: !!(initialSearch || tagsParam),
    };
    return createSearchStore(defaultInitStateWithParams);
  });

  return (
    <SearchStoreContext.Provider value={store}>
      {children}
    </SearchStoreContext.Provider>
  );
};
export const useSearchStore = <T,>(selector: (store: SearchStore) => T): T => {
  const searchStoreContext = useContext(SearchStoreContext);
  if (!searchStoreContext) {
    throw new Error('useSearchStore must be used within SearchStoreProvider');
  }

  return useStore(searchStoreContext, selector);
};
