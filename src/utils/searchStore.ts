import { createStore } from 'zustand/vanilla';

export type SearchState = {
  search: string;
  tag: string;
};

export type SearchAction = {
  setSearch: (search: SearchState['search']) => void;
  setTag: (tag: SearchState['tag']) => void;
};
export const defaultInitState: SearchState = {
  search: '',
  tag: 'All',
};
export type SearchStore = SearchState & SearchAction;
export const createSearchStore = (
  initState: SearchState = defaultInitState,
) => {
  return createStore<SearchStore>((set) => ({
    ...initState,
    setSearch: (search: string) => set(() => ({ search: search })),
    setTag: (tag: string) => set(() => ({ tag: tag })),
  }));
};
