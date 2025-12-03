import { createStore } from 'zustand/vanilla';

export type SearchState = {
  search: string;
  tags: string[];
  shouldFocus: boolean;
};

export type SearchAction = {
  setSearch: (search: SearchState['search']) => void;
  setTags: (tags: SearchState['tags']) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setShouldFocus: (val: boolean) => void;
};
export const defaultInitState: SearchState = {
  search: '',
  tags: [],
  shouldFocus: false,
};
export type SearchStore = SearchState & SearchAction;
export const createSearchStore = (
  initState: SearchState = defaultInitState,
) => {
  return createStore<SearchStore>((set) => ({
    ...initState,
    setSearch: (search: string) => set(() => ({ search: search })),
    addTag: (tag: string) =>
      set(({ tags }) => ({ tags: tags.includes(tag) ? tags : [...tags, tag] })),
    removeTag: (tag: string) =>
      set(({ tags }) => ({ tags: [...tags.filter((t) => t != tag)] })),
    setTags: (tags: string[]) => set(() => ({ tags: tags })),
    setShouldFocus: (val: boolean) => set(() => ({ shouldFocus: val })),
  }));
};
