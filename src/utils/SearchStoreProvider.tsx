'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
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

type SearchStoreProviderProps = {
  initialSearch?: string;
  initialTags?: string[];
  children: ReactNode;
};

export const SearchStoreProvider = ({
  initialSearch,
  initialTags,
  children,
}: SearchStoreProviderProps) => {
  const storeRef = useRef<SearchStoreApi | null>(null);
  if (!storeRef.current) {
    const defaultInitStateWithParams = {
      ...defaultInitState,
      search: initialSearch ?? defaultInitState.search,
      tags: initialTags ?? defaultInitState.tags,
    };
    storeRef.current = createSearchStore(defaultInitStateWithParams);
  }
  return (
    <SearchStoreContext.Provider value={storeRef.current}>
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
