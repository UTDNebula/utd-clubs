'use client';

import { createContext, useContext, useRef, type ReactNode } from 'react';
import { useStore } from 'zustand';
import { createSearchStore, type SearchStore } from './searchStore';

export type SearchStoreApi = ReturnType<typeof createSearchStore>;

export const SearchStoreContext = createContext<SearchStoreApi | undefined>(
  undefined,
);

type SearchStoreProviderProps = {
  children: ReactNode;
};

export const SearchStoreProvider = ({ children }: SearchStoreProviderProps) => {
  const storeRef = useRef<SearchStoreApi | null>(null);
  if (!storeRef.current) {
    storeRef.current = createSearchStore();
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
